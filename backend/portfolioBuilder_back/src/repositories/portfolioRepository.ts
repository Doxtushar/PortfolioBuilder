import type { QueryResultRow } from "pg";

import { pool } from "../config/database.js";
import type { CreatePortfolioInput, UpdatePortfolioInput } from "../types/portfolio.js";
import { AppError } from "../utils/AppError.js";

export type PortfolioRecord = {
  id: string;
  username: string;
  title: string;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PortfolioRepository = {
  create(userId: string, input: CreatePortfolioInput): Promise<PortfolioRecord>;
  findByUserId(userId: string): Promise<PortfolioRecord | null>;
  update(userId: string, input: UpdatePortfolioInput): Promise<PortfolioRecord | null>;
};

const mapPortfolio = (row: QueryResultRow): PortfolioRecord => ({
  id: String(row.id),
  username: String(row.username),
  title: String(row.title),
  bio: row.bio === null ? null : String(row.bio),
  createdAt: new Date(String(row.created_at)),
  updatedAt: new Date(String(row.updated_at)),
});

const requirePool = () => {
  if (!pool) {
    throw new AppError("Database is not configured", 503, "DATABASE_NOT_CONFIGURED");
  }

  return pool;
};

export const portfolioRepository: PortfolioRepository = {
  async create(userId, input) {
    const result = await requirePool().query(
      `
        INSERT INTO portfolios (user_id, username, title, bio)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, title, bio, created_at, updated_at
      `,
      [userId, input.username, input.title, input.bio],
    );

    return mapPortfolio(result.rows[0]);
  },

  async findByUserId(userId) {
    const result = await requirePool().query(
      `
        SELECT id, username, title, bio, created_at, updated_at
        FROM portfolios
        WHERE user_id = $1
      `,
      [userId],
    );

    return result.rows.length === 0 ? null : mapPortfolio(result.rows[0]);
  },

  async update(userId, input) {
    const result = await requirePool().query(
      `
        UPDATE portfolios
        SET username = $2, title = $3, bio = $4, updated_at = now()
        WHERE user_id = $1
        RETURNING id, username, title, bio, created_at, updated_at
      `,
      [userId, input.username, input.title, input.bio],
    );

    return result.rows.length === 0 ? null : mapPortfolio(result.rows[0]);
  },
};
