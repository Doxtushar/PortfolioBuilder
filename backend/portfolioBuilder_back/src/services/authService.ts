import bcrypt from "bcryptjs";

import {
  authRepository,
  getConstraintName,
  isUniqueViolation,
  type AuthRepository,
} from "../repositories/authRepository.js";
import type { RegisterUserInput, RegistrationResult } from "../types/auth.js";
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
});

export const authService = createAuthService();
