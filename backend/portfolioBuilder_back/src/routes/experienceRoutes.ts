import { Router } from 'express';

import {
  createExperience,
  deleteExperience,
  getExperience,
  getExperiences,
  updateExperience,
} from '../controllers/experienceController.js';
import { authenticate } from '../middleware/auth.js';
import { attachPortfolioId } from '../middleware/portfolio.js';

export const experienceRouter = Router();

experienceRouter.get('/portfolio/experiences', authenticate, attachPortfolioId, getExperiences);
experienceRouter.post('/portfolio/experiences', authenticate, attachPortfolioId, createExperience);
experienceRouter.get('/portfolio/experiences/:id', authenticate, attachPortfolioId, getExperience);
experienceRouter.put('/portfolio/experiences/:id', authenticate, attachPortfolioId, updateExperience);
experienceRouter.delete(
  '/portfolio/experiences/:id',
  authenticate,
  attachPortfolioId,
  deleteExperience,
);
