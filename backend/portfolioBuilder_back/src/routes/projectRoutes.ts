import { Router } from "express";

import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { authenticate } from "../middleware/auth.js";
import { attachPortfolioId } from "../middleware/portfolio.js";

export const projectRouter = Router();

projectRouter.get("/portfolio/projects", authenticate, attachPortfolioId, getProjects);
projectRouter.post("/portfolio/projects", authenticate, attachPortfolioId, createProject);
projectRouter.get("/portfolio/projects/:id", authenticate, attachPortfolioId, getProject);
projectRouter.put("/portfolio/projects/:id", authenticate, attachPortfolioId, updateProject);
projectRouter.delete("/portfolio/projects/:id", authenticate, attachPortfolioId, deleteProject);
