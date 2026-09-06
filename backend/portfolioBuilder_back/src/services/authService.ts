import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import {
  authRepository,
  getConstraintName,
  isUniqueViolation,
  type AuthRepository,
} from "../repositories/authRepository.js";
import type { CurrentUser, LoginUserInput, LoginResult, RegisterUserInput, RegistrationResult } from "../types/auth.js";
import { AppError } from "../utils/AppError.js";
import { createUsernameBase, createUsernameCandidate } from "../utils/slug.js";

const PASSWORD_HASH_ROUNDS = 12;
const MAX_USERNAME_ATTEMPTS = 25;

export type PasswordHasher = {
  hash(password: string): Promise<string>;
};

const bcryptPasswordHasher: PasswordHasher = {
  hash(password) {
    return bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
  },
};

type AuthServiceDependencies = {
  repository?: AuthRepository;
  passwordHasher?: PasswordHasher;
};

export const createAuthService = ({
  repository = authRepository,
  passwordHasher = bcryptPasswordHasher,
}: AuthServiceDependencies = {}) => ({
  async registerUser(input: RegisterUserInput): Promise<RegistrationResult> {
    const passwordHash = await passwordHasher.hash(input.password);
    const usernameBase = createUsernameBase(input.name, input.email);

    try {
      return await repository.withRegistrationTransaction(async (transaction) => {
        const user = await transaction.createUser({
          name: input.name,
          email: input.email,
          passwordHash,
        });

        for (let attempt = 0; attempt < MAX_USERNAME_ATTEMPTS; attempt += 1) {
          const username = createUsernameCandidate(usernameBase, attempt);

          try {
            const portfolio = await transaction.createPortfolio({
              userId: user.id,
              username,
              title: `${user.name}'s Portfolio`,
              bio: null,
            });

            return {
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
              },
              portfolio: {
                id: portfolio.id,
                username: portfolio.username,
                title: portfolio.title,
                createdAt: portfolio.createdAt.toISOString(),
              },
            };
          } catch (error) {
            if (
              isUniqueViolation(error) &&
              getConstraintName(error) === "portfolios_username_unique"
            ) {
              continue;
            }

            throw error;
          }
        }

        throw new AppError("Could not generate a unique username", 409, "USERNAME_ALREADY_EXISTS");
      });
    } catch (error) {
      if (
        isUniqueViolation(error) &&
        getConstraintName(error) === "users_email_unique"
      ) {
        throw new AppError("Email is already registered", 409, "EMAIL_ALREADY_EXISTS");
      }

      throw error;
    }
  },

  async loginUser(input: LoginUserInput): Promise<LoginResult> {
    if (!env.jwtSecret) {
      throw new AppError("JWT secret is not configured", 500, "JWT_SECRET_NOT_CONFIGURED");
    }

    const user = await repository.findUserByEmail(input.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn } as jwt.SignOptions,
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
      token,
    };
  },

  async getCurrentUser(userId: string): Promise<CurrentUser> {
    const user = await repository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 401, "USER_NOT_FOUND");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  },
});

export const authService = createAuthService();
