import { Router } from 'express';

import {
  createEducation,
  deleteEducation,
  getEducation,
  getEducationById,
  updateEducation,
} from '../controllers/educationController.js';
import { authenticate } from '../middleware/auth.js';
import { attachPortfolioId } from '../middleware/portfolio.js';

export const educationRouter = Router();

educationRouter.get('/portfolio/education', authenticate, attachPortfolioId, getEducation);
educationRouter.post('/portfolio/education', authenticate, attachPortfolioId, createEducation);
educationRouter.get('/portfolio/education/:id', authenticate, attachPortfolioId, getEducationById);
educationRouter.put('/portfolio/education/:id', authenticate, attachPortfolioId, updateEducation);
educationRouter.delete('/portfolio/education/:id', authenticate, attachPortfolioId, deleteEducation);
