import type { QueryResultRow } from 'pg';

import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import type { CreateEducationInput, Education } from '../types/education.js';

export type EducationRecord = {
  id: string;
  portfolio_id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  location: string | null;
  start_date: Date;
  end_date: Date | null;
  is_current: boolean;
  description: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
};

const mapEducation = (row: QueryResultRow): Education => ({
  id: String(row.id),
  portfolioId: String(row.portfolio_id),
  institution: String(row.institution),
  degree: String(row.degree),
  fieldOfStudy: row.field_of_study === null ? null : String(row.field_of_study),
  location: row.location === null ? null : String(row.location),
  startDate: String(row.start_date),
  endDate: row.end_date === null ? null : String(row.end_date),
  isCurrent: Boolean(row.is_current),
  description: row.description === null ? null : String(row.description),
  displayOrder: Number(row.display_order),
  createdAt: new Date(String(row.created_at)),
  updatedAt: new Date(String(row.updated_at)),
});

const requirePool = () => {
  if (!pool) {
    throw new AppError('Database is not configured', 503, 'DATABASE_NOT_CONFIGURED');
  }

  return pool;
};

export const educationRepository = {
  async create(portfolioId: string, input: CreateEducationInput): Promise<Education> {
    const result = await requirePool().query(
      `INSERT INTO education (portfolio_id, institution, degree, field_of_study, location, start_date, end_date, is_current, description, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, portfolio_id, institution, degree, field_of_study, location, start_date, end_date, is_current, description, display_order, created_at, updated_at`,
      [
        portfolioId,
        input.institution,
        input.degree,
        input.fieldOfStudy || null,
        input.location || null,
        input.startDate,
        input.endDate || null,
        input.isCurrent ?? false,
        input.description || null,
        input.displayOrder ?? 0,
      ],
    );

    return mapEducation(result.rows[0]);
  },

  async findByPortfolioId(portfolioId: string): Promise<Education[]> {
    const result = await requirePool().query(
      `SELECT id, portfolio_id, institution, degree, field_of_study, location, start_date, end_date, is_current, description, display_order, created_at, updated_at
       FROM education
       WHERE portfolio_id = $1
       ORDER BY display_order ASC, start_date DESC`,
      [portfolioId],
    );

    return result.rows.map(mapEducation);
  },

  async findByIdAndPortfolioId(id: string, portfolioId: string): Promise<Education | null> {
    const result = await requirePool().query(
      `SELECT id, portfolio_id, institution, degree, field_of_study, location, start_date, end_date, is_current, description, display_order, created_at, updated_at
       FROM education
       WHERE id = $1 AND portfolio_id = $2`,
      [id, portfolioId],
    );

    return result.rows.length === 0 ? null : mapEducation(result.rows[0]);
  },

  async update(id: string, portfolioId: string, input: Partial<CreateEducationInput>): Promise<Education | null> {
    const result = await requirePool().query(
      `UPDATE education
       SET institution = $2, degree = $3, field_of_study = $4, location = $5, start_date = $6, end_date = $7, is_current = $8, description = $9, display_order = $10, updated_at = now()
       WHERE id = $1 AND portfolio_id = $11
       RETURNING id, portfolio_id, institution, degree, field_of_study, location, start_date, end_date, is_current, description, display_order, created_at, updated_at`,
      [
        id,
        input.institution,
        input.degree,
        input.fieldOfStudy ?? null,
        input.location ?? null,
        input.startDate,
        input.endDate ?? null,
        input.isCurrent ?? false,
        input.description ?? null,
        input.displayOrder ?? 0,
        portfolioId,
      ],
    );

    return result.rows.length === 0 ? null : mapEducation(result.rows[0]);
  },

  async delete(id: string, portfolioId: string): Promise<boolean> {
    const result = await requirePool().query(
      `DELETE FROM education
       WHERE id = $1 AND portfolio_id = $2`,
      [id, portfolioId],
    );

    return (result.rowCount ?? 0) > 0;
  },
};
