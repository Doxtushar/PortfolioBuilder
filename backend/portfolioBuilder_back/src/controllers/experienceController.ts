import type { Request, Response } from 'express';

import { experienceService } from '../services/experienceService.js';
import {
  validateCreateExperienceInput,
  validateUpdateExperienceInput,
} from '../validators/experienceValidator.js';

const getPortfolioId = (req: Request): string => {
  if (!req.portfolioId) {
    throw new Error('Portfolio ID not found in request');
  }

  return req.portfolioId;
};

export const createExperience = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const input = validateCreateExperienceInput(req.body);

  const experience = await experienceService.createExperience(portfolioId, input);

  res.status(201).json({
    success: true,
    data: experience,
    message: 'Experience created successfully',
  });
};

export const getExperiences = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);

  const experiences = await experienceService.getExperiences(portfolioId);

  res.json({
    success: true,
    data: experiences,
    message: 'Experiences retrieved successfully',
  });
};

export const getExperience = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;

  const experience = await experienceService.getExperience(id, portfolioId);

  res.json({
    success: true,
    data: experience,
    message: 'Experience retrieved successfully',
  });
};

export const updateExperience = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;
  const input = validateUpdateExperienceInput(req.body);

  const experience = await experienceService.updateExperience(id, portfolioId, input);

  res.json({
    success: true,
    data: experience,
    message: 'Experience updated successfully',
  });
};

export const deleteExperience = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;

  await experienceService.deleteExperience(id, portfolioId);

  res.json({
    success: true,
    data: null,
    message: 'Experience deleted successfully',
  });
};
