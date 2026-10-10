import type { Request, Response } from 'express';

import { certificationService } from '../services/certificationService.js';
import {
  validateCreateCertificationInput,
  validateUpdateCertificationInput,
} from '../validators/certificationValidator.js';

const getPortfolioId = (req: Request): string => {
  if (!req.portfolioId) {
    throw new Error('Portfolio ID not found in request');
  }

  return req.portfolioId;
};

export const createCertification = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const input = validateCreateCertificationInput(req.body);

  const certification = await certificationService.createCertification(portfolioId, input);

  res.status(201).json({
    success: true,
    data: certification,
    message: 'Certification created successfully',
  });
};

export const getCertifications = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);

  const certifications = await certificationService.getCertifications(portfolioId);

  res.json({
    success: true,
    data: certifications,
    message: 'Certifications retrieved successfully',
  });
};

export const getCertificationById = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;

  const certification = await certificationService.getCertificationById(id, portfolioId);

  res.json({
    success: true,
    data: certification,
    message: 'Certification retrieved successfully',
  });
};

export const updateCertification = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;
  const input = validateUpdateCertificationInput(req.body);

  const certification = await certificationService.updateCertification(id, portfolioId, input);

  res.json({
    success: true,
    data: certification,
    message: 'Certification updated successfully',
  });
};

export const deleteCertification = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;

  await certificationService.deleteCertification(id, portfolioId);

  res.json({
    success: true,
    data: null,
    message: 'Certification deleted successfully',
  });
};
