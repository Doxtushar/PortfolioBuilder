import type { PoolClient, QueryResultRow } from "pg";

import { pool } from "../config/database.js";
import { AppError } from "../utils/AppError.js";

export const UNIQUE_VIOLATION_CODE = "23505";

export type NewUserRecord = {
  name: string;
  email: string;
  passwordHash: string;
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type PortfolioRecord = {
  id: string;
  username: string;
  title: string;
  createdAt: Date;
};

export type RegistrationTransaction = {
  createUser(input: NewUserRecord): Promise<UserRecord>;
  createPortfolio(input: {
    userId: string;
    username: string;
    title: string;
    bio: string | null;
  }): Promise<PortfolioRecord>;
};

export type AuthRepository = {
  withRegistrationTransaction<T>(
    callback: (transaction: RegistrationTransaction) => Promise<T>,
  ): Promise<T>;
};

const mapUser = (row: QueryResultRow): UserRecord => ({
  id: String(row.id),
  name: String(row.name),
  email: String(row.email),
  createdAt: new Date(String(row.created_at)),
});

const mapPortfolio = (row: QueryResultRow): PortfolioRecord => ({
  id: String(row.id),
  username: String(row.username),
  title: String(row.title),
  createdAt: new Date(String(row.created_at)),
});

const createTransaction = (client: PoolClient): RegistrationTransaction => ({
  async createUser(input) {
    const result = await client.query(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
      `,
      [input.name, input.email, input.passwordHash],
    );

    return mapUser(result.rows[0]);
  },

  async createPortfolio(input) {
    await client.query("SAVEPOINT portfolio_insert_attempt");

    try {
      const result = await client.query(
        `
          INSERT INTO portfolios (user_id, username, title, bio)
          VALUES ($1, $2, $3, $4)
          RETURNING id, username, title, created_at
        `,
        [input.userId, input.username, input.title, input.bio],
      );

      await client.query("RELEASE SAVEPOINT portfolio_insert_attempt");

      return mapPortfolio(result.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK TO SAVEPOINT portfolio_insert_attempt");
      throw error;
    }
  },
});

export const authRepository: AuthRepository = {
  async withRegistrationTransaction(callback) {
    if (!pool) {
      throw new AppError("Database is not configured", 503, "DATABASE_NOT_CONFIGURED");
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const result = await callback(createTransaction(client));
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

export const isUniqueViolation = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === UNIQUE_VIOLATION_CODE;

export const getConstraintName = (error: unknown): string | undefined => {
  if (typeof error !== "object" || error === null || !("constraint" in error)) {
    return undefined;
  }

  return typeof error.constraint === "string" ? error.constraint : undefined;
};
