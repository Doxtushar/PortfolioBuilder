import type { QueryResultRow } from 'pg';

import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import type { CreateExperienceInput, Experience } from '../types/experience.js';

export type ExperienceRecord = {
  id: string;
  portfolio_id: string;
  company_name: string;
  job_title: string;
  employment_type: string | null;
  location: string | null;
  start_date: Date;
  end_date: Date | null;
  is_current: boolean;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};

const mapExperience = (row: QueryResultRow): Experience => ({
  id: String(row.id),
  portfolioId: String(row.portfolio_id),
  companyName: String(row.company_name),
  jobTitle: String(row.job_title),
  employmentType: row.employment_type === null ? null : String(row.employment_type),
  location: row.location === null ? null : String(row.location),
  startDate: String(row.start_date),
  endDate: row.end_date === null ? null : String(row.end_date),
  isCurrent: Boolean(row.is_current),
  description: row.description === null ? null : String(row.description),
  createdAt: new Date(String(row.created_at)),
  updatedAt: new Date(String(row.updated_at)),
});

const requirePool = () => {
  if (!pool) {
    throw new AppError('Database is not configured', 503, 'DATABASE_NOT_CONFIGURED');
  }

  return pool;
};

export const experienceRepository = {
  async create(portfolioId: string, input: CreateExperienceInput): Promise<Experience> {
    const result = await requirePool().query(
      `INSERT INTO experiences (portfolio_id, company_name, job_title, employment_type, location, start_date, end_date, is_current, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, portfolio_id, company_name, job_title, employment_type, location, start_date, end_date, is_current, description, created_at, updated_at`,
      [
        portfolioId,
        input.companyName,
        input.jobTitle,
        input.employmentType || null,
        input.location || null,
        input.startDate,
        input.endDate || null,
        input.isCurrent ?? false,
        input.description || null,
      ],
    );

    return mapExperience(result.rows[0]);
  },

  async findByPortfolioId(portfolioId: string): Promise<Experience[]> {
    const result = await requirePool().query(
      `SELECT id, portfolio_id, company_name, job_title, employment_type, location, start_date, end_date, is_current, description, created_at, updated_at
       FROM experiences
       WHERE portfolio_id = $1
       ORDER BY start_date DESC`,
      [portfolioId],
    );

    return result.rows.map(mapExperience);
  },

  async findByIdAndPortfolioId(id: string, portfolioId: string): Promise<Experience | null> {
    const result = await requirePool().query(
      `SELECT id, portfolio_id, company_name, job_title, employment_type, location, start_date, end_date, is_current, description, created_at, updated_at
       FROM experiences
       WHERE id = $1 AND portfolio_id = $2`,
      [id, portfolioId],
    );

    return result.rows.length === 0 ? null : mapExperience(result.rows[0]);
  },

  async update(id: string, portfolioId: string, input: Partial<CreateExperienceInput>): Promise<Experience | null> {
    const result = await requirePool().query(
      `UPDATE experiences
       SET company_name = $2, job_title = $3, employment_type = $4, location = $5, start_date = $6, end_date = $7, is_current = $8, description = $9, updated_at = now()
       WHERE id = $1 AND portfolio_id = $10
       RETURNING id, portfolio_id, company_name, job_title, employment_type, location, start_date, end_date, is_current, description, created_at, updated_at`,
      [
        id,
        input.companyName,
        input.jobTitle,
        input.employmentType ?? null,
        input.location ?? null,
        input.startDate,
        input.endDate ?? null,
        input.isCurrent ?? false,
        input.description ?? null,
        portfolioId,
      ],
    );

    return result.rows.length === 0 ? null : mapExperience(result.rows[0]);
  },

  async delete(id: string, portfolioId: string): Promise<boolean> {
    const result = await requirePool().query(
      `DELETE FROM experiences
       WHERE id = $1 AND portfolio_id = $2`,
      [id, portfolioId],
    );

    return (result.rowCount ?? 0) > 0;
  },
};
