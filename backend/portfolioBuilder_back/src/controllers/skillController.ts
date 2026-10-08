import type { Request, Response } from 'express';

import { skillService } from '../services/skillService.js';
import {
  validateCreateSkillInput,
  validateUpdateSkillInput,
} from '../validators/skillValidator.js';

const getPortfolioId = (req: Request): string => {
  if (!req.portfolioId) {
    throw new Error('Portfolio ID not found in request');
  }

  return req.portfolioId;
};

export const createSkill = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const input = validateCreateSkillInput(req.body);

  const skill = await skillService.createSkill(portfolioId, input);

  res.status(201).json({
    success: true,
    data: skill,
    message: 'Skill created successfully',
  });
};

export const getSkills = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);

  const skills = await skillService.getSkills(portfolioId);

  res.json({
    success: true,
    data: skills,
    message: 'Skills retrieved successfully',
  });
};

export const getSkill = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;

  const skill = await skillService.getSkill(id, portfolioId);

  res.json({
    success: true,
    data: skill,
    message: 'Skill retrieved successfully',
  });
};

export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;
  const input = validateUpdateSkillInput(req.body);

  const skill = await skillService.updateSkill(id, portfolioId, input);

  res.json({
    success: true,
    data: skill,
    message: 'Skill updated successfully',
  });
};

export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  const portfolioId = getPortfolioId(req);
  const id = req.params.id as string;

  await skillService.deleteSkill(id, portfolioId);

  res.json({
    success: true,
    data: null,
    message: 'Skill deleted successfully',
  });
};
