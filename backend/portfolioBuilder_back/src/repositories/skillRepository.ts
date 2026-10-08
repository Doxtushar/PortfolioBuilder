import type { QueryResultRow } from 'pg';

import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import type { CreateSkillInput, Skill } from '../types/skill.js';

export type SkillRecord = {
  id: string;
  portfolio_id: string;
  name: string;
  category: string;
  proficiency: number | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
};

const mapSkill = (row: QueryResultRow): Skill => ({
  id: String(row.id),
  portfolioId: String(row.portfolio_id),
  name: String(row.name),
  category: String(row.category),
  proficiency: row.proficiency === null ? null : Number(row.proficiency),
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

export const skillRepository = {
  async create(portfolioId: string, input: CreateSkillInput): Promise<Skill> {
    const result = await requirePool().query(
      `INSERT INTO skills (portfolio_id, name, category, proficiency, display_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, portfolio_id, name, category, proficiency, display_order, created_at, updated_at`,
      [
        portfolioId,
        input.name,
        input.category,
        input.proficiency ?? null,
        input.displayOrder ?? 0,
      ],
    );

    return mapSkill(result.rows[0]);
  },

  async findByPortfolioId(portfolioId: string): Promise<Skill[]> {
    const result = await requirePool().query(
      `SELECT id, portfolio_id, name, category, proficiency, display_order, created_at, updated_at
       FROM skills
       WHERE portfolio_id = $1
       ORDER BY display_order ASC, created_at ASC`,
      [portfolioId],
    );

    return result.rows.map(mapSkill);
  },

  async findByIdAndPortfolioId(id: string, portfolioId: string): Promise<Skill | null> {
    const result = await requirePool().query(
      `SELECT id, portfolio_id, name, category, proficiency, display_order, created_at, updated_at
       FROM skills
       WHERE id = $1 AND portfolio_id = $2`,
      [id, portfolioId],
    );

    return result.rows.length === 0 ? null : mapSkill(result.rows[0]);
  },

  async update(id: string, portfolioId: string, input: Partial<CreateSkillInput>): Promise<Skill | null> {
    const result = await requirePool().query(
      `UPDATE skills
       SET name = $2, category = $3, proficiency = $4, display_order = $5, updated_at = now()
       WHERE id = $1 AND portfolio_id = $6
       RETURNING id, portfolio_id, name, category, proficiency, display_order, created_at, updated_at`,
      [
        id,
        input.name,
        input.category,
        input.proficiency ?? null,
        input.displayOrder ?? 0,
        portfolioId,
      ],
    );

    return result.rows.length === 0 ? null : mapSkill(result.rows[0]);
  },

  async delete(id: string, portfolioId: string): Promise<boolean> {
    const result = await requirePool().query(
      `DELETE FROM skills
       WHERE id = $1 AND portfolio_id = $2`,
      [id, portfolioId],
    );

    return (result.rowCount ?? 0) > 0;
  },
};
