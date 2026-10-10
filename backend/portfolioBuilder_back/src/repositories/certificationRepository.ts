import type { QueryResultRow } from 'pg';

import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import type { CreateCertificationInput, Certification } from '../types/certification.js';

export type CertificationRecord = {
  id: string;
  portfolio_id: string;
  name: string;
  issuing_organization: string;
  issue_date: Date | null;
  expiration_date: Date | null;
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
};

const mapCertification = (row: QueryResultRow): Certification => ({
  id: String(row.id),
  portfolioId: String(row.portfolio_id),
  name: String(row.name),
  issuingOrganization: String(row.issuing_organization),
  issueDate: row.issue_date === null ? null : String(row.issue_date),
  expirationDate: row.expiration_date === null ? null : String(row.expiration_date),
  credentialId: row.credential_id === null ? null : String(row.credential_id),
  credentialUrl: row.credential_url === null ? null : String(row.credential_url),
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

export const certificationRepository = {
  async create(portfolioId: string, input: CreateCertificationInput): Promise<Certification> {
    const result = await requirePool().query(
      `INSERT INTO certifications (portfolio_id, name, issuing_organization, issue_date, expiration_date, credential_id, credential_url, description, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, portfolio_id, name, issuing_organization, issue_date, expiration_date, credential_id, credential_url, description, display_order, created_at, updated_at`,
      [
        portfolioId,
        input.name,
        input.issuingOrganization,
        input.issueDate || null,
        input.expirationDate || null,
        input.credentialId || null,
        input.credentialUrl || null,
        input.description || null,
        input.displayOrder ?? 0,
      ],
    );

    return mapCertification(result.rows[0]);
  },

  async findByPortfolioId(portfolioId: string): Promise<Certification[]> {
    const result = await requirePool().query(
      `SELECT id, portfolio_id, name, issuing_organization, issue_date, expiration_date, credential_id, credential_url, description, display_order, created_at, updated_at
       FROM certifications
       WHERE portfolio_id = $1
       ORDER BY display_order ASC, issue_date DESC`,
      [portfolioId],
    );

    return result.rows.map(mapCertification);
  },

  async findByIdAndPortfolioId(id: string, portfolioId: string): Promise<Certification | null> {
    const result = await requirePool().query(
      `SELECT id, portfolio_id, name, issuing_organization, issue_date, expiration_date, credential_id, credential_url, description, display_order, created_at, updated_at
       FROM certifications
       WHERE id = $1 AND portfolio_id = $2`,
      [id, portfolioId],
    );

    return result.rows.length === 0 ? null : mapCertification(result.rows[0]);
  },

  async update(id: string, portfolioId: string, input: Partial<CreateCertificationInput>): Promise<Certification | null> {
    const result = await requirePool().query(
      `UPDATE certifications
       SET name = $2, issuing_organization = $3, issue_date = $4, expiration_date = $5, credential_id = $6, credential_url = $7, description = $8, display_order = $9, updated_at = now()
       WHERE id = $1 AND portfolio_id = $10
       RETURNING id, portfolio_id, name, issuing_organization, issue_date, expiration_date, credential_id, credential_url, description, display_order, created_at, updated_at`,
      [
        id,
        input.name,
        input.issuingOrganization,
        input.issueDate ?? null,
        input.expirationDate ?? null,
        input.credentialId ?? null,
        input.credentialUrl ?? null,
        input.description ?? null,
        input.displayOrder ?? 0,
        portfolioId,
      ],
    );

    return result.rows.length === 0 ? null : mapCertification(result.rows[0]);
  },

  async delete(id: string, portfolioId: string): Promise<boolean> {
    const result = await requirePool().query(
      `DELETE FROM certifications
       WHERE id = $1 AND portfolio_id = $2`,
      [id, portfolioId],
    );

    return (result.rowCount ?? 0) > 0;
  },
};
