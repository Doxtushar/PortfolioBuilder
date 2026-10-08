import type { Request, Response } from 'express';

import { educationService } from '../services/educationService.js';
import {
  validateCreateEducationInput,
  validateUpdateEducationInput,
} from '../validators/educationValidator.js';

const getPortfolioId = (req: Request): string => {
  if (!req.portfolioId) {
    throw new Error('Portfolio ID not found in request');
  }

  return req.portfolioId;
};

export const createEducation = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const input = validateCreateEducationInput(req.body);

  const education = await educationService.createEducation(portfolioId, input);

  res.status(201).json({
    success: true,
    data: education,
    message: 'Education created successfully',
  });
};

export const getEducation = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);

  const education = await educationService.getEducation(portfolioId);

  res.json({
    success: true,
    data: education,
    message: 'Education retrieved successfully',
  });
};

export const getEducationById = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;

  const education = await educationService.getEducationById(id, portfolioId);

  res.json({
    success: true,
    data: education,
    message: 'Education retrieved successfully',
  });
};

export const updateEducation = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;
  const input = validateUpdateEducationInput(req.body);

  const education = await educationService.updateEducation(id, portfolioId, input);

  res.json({
    success: true,
    data: education,
    message: 'Education updated successfully',
  });
};

export const deleteEducation = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;

  await educationService.deleteEducation(id, portfolioId);

  res.json({
    success: true,
    data: null,
    message: 'Education deleted successfully',
  });
};
