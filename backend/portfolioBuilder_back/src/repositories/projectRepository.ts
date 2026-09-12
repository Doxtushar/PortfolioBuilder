import type { QueryResultRow } from "pg";

import { pool } from "../config/database.js";
import type { CreateProjectInput, UpdateProjectInput } from "../types/project.js";
import { AppError } from "../utils/AppError.js";

export type ProjectRecord = {
  id: string;
  portfolioId: string;
  title: string;
  description: string | null;
  technologies: string | null;
  projectUrl: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectRepository = {
  create(portfolioId: string, input: CreateProjectInput): Promise<ProjectRecord>;
  findByPortfolioId(portfolioId: string): Promise<ProjectRecord[]>;
  findByIdAndPortfolioId(id: string, portfolioId: string): Promise<ProjectRecord | null>;
  update(id: string, portfolioId: string, input: UpdateProjectInput): Promise<ProjectRecord | null>;
  delete(id: string, portfolioId: string): Promise<boolean>;
};

const mapProject = (row: QueryResultRow): ProjectRecord => ({
  id: String(row.id),
  portfolioId: String(row.portfolio_id),
  title: String(row.title),
  description: row.description === null ? null : String(row.description),
  technologies: row.technologies === null ? null : String(row.technologies),
  projectUrl: row.project_url === null ? null : String(row.project_url),
  githubUrl: row.github_url === null ? null : String(row.github_url),
  imageUrl: row.image_url === null ? null : String(row.image_url),
  createdAt: new Date(String(row.created_at)),
  updatedAt: new Date(String(row.updated_at)),
});

const requirePool = () => {
  if (!pool) {
    throw new AppError("Database is not configured", 503, "DATABASE_NOT_CONFIGURED");
  }

  return pool;
};

export const projectRepository: ProjectRepository = {
  async create(portfolioId, input) {
    const result = await requirePool().query(
      `
        INSERT INTO projects (portfolio_id, title, description, technologies, project_url, github_url, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, portfolio_id, title, description, technologies, project_url, github_url, image_url, created_at, updated_at
      `,
      [
        portfolioId,
        input.title,
        input.description || null,
        input.technologies || null,
        input.projectUrl || null,
        input.githubUrl || null,
        input.imageUrl || null,
      ],
    );

    return mapProject(result.rows[0]);
  },

  async findByPortfolioId(portfolioId) {
    const result = await requirePool().query(
      `
        SELECT id, portfolio_id, title, description, technologies, project_url, github_url, image_url, created_at, updated_at
        FROM projects
        WHERE portfolio_id = $1
        ORDER BY created_at DESC
      `,
      [portfolioId],
    );

    return result.rows.map(mapProject);
  },

  async findByIdAndPortfolioId(id, portfolioId) {
    const result = await requirePool().query(
      `
        SELECT id, portfolio_id, title, description, technologies, project_url, github_url, image_url, created_at, updated_at
        FROM projects
        WHERE id = $1 AND portfolio_id = $2
      `,
      [id, portfolioId],
    );

    return result.rows.length === 0 ? null : mapProject(result.rows[0]);
  },

  async update(id, portfolioId, input) {
    const result = await requirePool().query(
      `
        UPDATE projects
        SET title = $2, description = $3, technologies = $4, project_url = $5, github_url = $6, image_url = $7, updated_at = now()
        WHERE id = $1 AND portfolio_id = $8
        RETURNING id, portfolio_id, title, description, technologies, project_url, github_url, image_url, created_at, updated_at
      `,
      [
        id,
        input.title,
        input.description || null,
        input.technologies || null,
        input.projectUrl || null,
        input.githubUrl || null,
        input.imageUrl || null,
        portfolioId,
      ],
    );

    return result.rows.length === 0 ? null : mapProject(result.rows[0]);
  },

  async delete(id, portfolioId) {
    const result = await requirePool().query(
      `
        DELETE FROM projects
        WHERE id = $1 AND portfolio_id = $2
      `,
      [id, portfolioId],
    );

    return (result.rowCount ?? 0) > 0;
  },
};
