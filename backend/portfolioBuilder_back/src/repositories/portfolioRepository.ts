import type { QueryResultRow } from "pg";

import { pool } from "../config/database.js";
import type { CreatePortfolioInput, UpdatePortfolioInput } from "../types/portfolio.js";
import { AppError } from "../utils/AppError.js";

export type PortfolioRecord = {
  id: string;
  username: string;
  title: string;
  bio: string | null;
  fullName: string | null;
  headline: string | null;
  location: string | null;
  introduction: string | null;
  profileImageUrl: string | null;
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
  fullName: row.full_name === null ? null : String(row.full_name),
  headline: row.headline === null ? null : String(row.headline),
  location: row.location === null ? null : String(row.location),
  introduction: row.introduction === null ? null : String(row.introduction),
  profileImageUrl: row.profile_image_url === null ? null : String(row.profile_image_url),
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
        INSERT INTO portfolios (user_id, username, title, bio, full_name, headline, location, introduction, profile_image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, username, title, bio, full_name, headline, location, introduction, profile_image_url, created_at, updated_at
      `,
      [
        userId,
        input.username,
        input.title,
        input.bio,
        input.fullName || null,
        input.headline || null,
        input.location || null,
        input.introduction || null,
        input.profileImageUrl || null,
      ],
    );

    return mapPortfolio(result.rows[0]);
  },

  async findByUserId(userId) {
    const result = await requirePool().query(
      `
        SELECT id, username, title, bio, full_name, headline, location, introduction, profile_image_url, created_at, updated_at
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
        SET username = $2, title = $3, bio = $4, full_name = $5, headline = $6, location = $7, introduction = $8, profile_image_url = $9, updated_at = now()
        WHERE user_id = $1
        RETURNING id, username, title, bio, full_name, headline, location, introduction, profile_image_url, created_at, updated_at
      `,
      [
        userId,
        input.username,
        input.title,
        input.bio,
        input.fullName || null,
        input.headline || null,
        input.location || null,
        input.introduction || null,
        input.profileImageUrl || null,
      ],
    );

    return result.rows.length === 0 ? null : mapPortfolio(result.rows[0]);
  },
};
