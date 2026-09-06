import { Router } from "express";

import {
  createPortfolio,
  getPortfolio,
  updatePortfolio,
} from "../controllers/portfolioController.js";
import { authenticate } from "../middleware/auth.js";

export const portfolioRouter = Router();

portfolioRouter.post("/portfolio", authenticate, createPortfolio);
portfolioRouter.get("/portfolio", authenticate, getPortfolio);
portfolioRouter.put("/portfolio", authenticate, updatePortfolio);
