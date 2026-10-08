import { Router } from 'express';

import {
  createSkill,
  deleteSkill,
  getSkill,
  getSkills,
  updateSkill,
} from '../controllers/skillController.js';
import { authenticate } from '../middleware/auth.js';
import { attachPortfolioId } from '../middleware/portfolio.js';

export const skillRouter = Router();

skillRouter.get('/portfolio/skills', authenticate, attachPortfolioId, getSkills);
skillRouter.post('/portfolio/skills', authenticate, attachPortfolioId, createSkill);
skillRouter.get('/portfolio/skills/:id', authenticate, attachPortfolioId, getSkill);
skillRouter.put('/portfolio/skills/:id', authenticate, attachPortfolioId, updateSkill);
skillRouter.delete('/portfolio/skills/:id', authenticate, attachPortfolioId, deleteSkill);
