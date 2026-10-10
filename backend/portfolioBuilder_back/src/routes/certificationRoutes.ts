import { Router } from 'express';

import {
  createCertification,
  deleteCertification,
  getCertificationById,
  getCertifications,
  updateCertification,
} from '../controllers/certificationController.js';
import { authenticate } from '../middleware/auth.js';
import { attachPortfolioId } from '../middleware/portfolio.js';

export const certificationRouter = Router();

certificationRouter.get('/portfolio/certifications', authenticate, attachPortfolioId, getCertifications);
certificationRouter.post('/portfolio/certifications', authenticate, attachPortfolioId, createCertification);
certificationRouter.get('/portfolio/certifications/:id', authenticate, attachPortfolioId, getCertificationById);
certificationRouter.put('/portfolio/certifications/:id', authenticate, attachPortfolioId, updateCertification);
certificationRouter.delete('/portfolio/certifications/:id', authenticate, attachPortfolioId, deleteCertification);
