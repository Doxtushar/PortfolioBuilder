import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  createAuthService,
  type PasswordHasher,
} from "../src/services/authService.js";
import type {
  AuthRepository,
  NewUserRecord,
  PortfolioRecord,
  RegistrationTransaction,
  UserRecord,
} from "../src/repositories/authRepository.js";
import { AppError } from "../src/utils/AppError.js";

const now = new Date("2026-09-05T00:00:00.000Z");

const createUserRecord = (input: NewUserRecord): UserRecord => ({
  id: "user-1",
  name: input.name,
  email: input.email,
  createdAt: now,
});

const createPortfolioRecord = (username: string): PortfolioRecord => ({
  id: "portfolio-1",
  username,
  title: "John Doe's Portfolio",
  createdAt: now,
});

const passwordHasher = (): PasswordHasher & { values: string[] } => {
  const values: string[] = [];

  return {
    values,
    async hash(password) {
      values.push(password);
      return "hashed-password";
    },
  };
};

describe("authService.registerUser", () => {
  it("creates a user and initial portfolio without returning password fields", async () => {
    let savedUser: NewUserRecord | undefined;
    let savedPortfolioUserId: string | undefined;
    const hasher = passwordHasher();

    const repository: AuthRepository = {
      async withRegistrationTransaction(callback) {
        const transaction: RegistrationTransaction = {
          async createUser(input) {
            savedUser = input;
            return createUserRecord(input);
          },
          async createPortfolio(input) {
            savedPortfolioUserId = input.userId;
            return createPortfolioRecord(input.username);
          },
        };

        return callback(transaction);
      },
    };

    const service = createAuthService({ repository, passwordHasher: hasher });
    const result = await service.registerUser({
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword123",
    });

    assert.equal(savedUser?.passwordHash, "hashed-password");
    assert.equal(savedPortfolioUserId, "user-1");
    assert.equal(result.user.email, "john@example.com");
    assert.equal(result.portfolio.username, "john-doe");
    assert.equal("password" in result.user, false);
    assert.equal("passwordHash" in result.user, false);
    assert.deepEqual(hasher.values, ["SecurePassword123"]);
  });

  it("retries username generation on portfolio username collisions", async () => {
    const attemptedUsernames: string[] = [];
    const repository: AuthRepository = {
      async withRegistrationTransaction(callback) {
        return callback({
          async createUser(input) {
            return createUserRecord(input);
          },
          async createPortfolio(input) {
            attemptedUsernames.push(input.username);

            if (input.username === "john-doe") {
              throw {
                code: "23505",
                constraint: "portfolios_username_unique",
              };
            }

            return createPortfolioRecord(input.username);
          },
        });
      },
    };

    const service = createAuthService({
      repository,
      passwordHasher: passwordHasher(),
    });

    const result = await service.registerUser({
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword123",
    });

    assert.deepEqual(attemptedUsernames, ["john-doe", "john-doe-2"]);
    assert.equal(result.portfolio.username, "john-doe-2");
  });

  it("maps duplicate email database errors to a conflict response", async () => {
    const repository: AuthRepository = {
      async withRegistrationTransaction(callback) {
        return callback({
          async createUser() {
            throw {
              code: "23505",
              constraint: "users_email_unique",
            };
          },
          async createPortfolio() {
            throw new Error("Portfolio should not be created");
          },
        });
      },
    };

    const service = createAuthService({
      repository,
      passwordHasher: passwordHasher(),
    });

    await assert.rejects(
      () =>
        service.registerUser({
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePassword123",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 409 &&
        error.code === "EMAIL_ALREADY_EXISTS",
    );
  });

  it("propagates transaction rollback failures from the repository", async () => {
    const transactionError = new Error("portfolio insert failed");
    const repository: AuthRepository = {
      async withRegistrationTransaction(callback) {
        try {
          return await callback({
            async createUser(input) {
              return createUserRecord(input);
            },
            async createPortfolio() {
              throw transactionError;
            },
          });
        } catch (error) {
          assert.equal(error, transactionError);
          throw error;
        }
      },
    };

    const service = createAuthService({
      repository,
      passwordHasher: passwordHasher(),
    });

    await assert.rejects(
      () =>
        service.registerUser({
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePassword123",
        }),
      transactionError,
    );
  });
});
