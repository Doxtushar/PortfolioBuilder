import type { Request, Response, NextFunction } from "express";

import { portfolioRepository } from "../repositories/portfolioRepository.js";
import { AppError } from "../utils/AppError.js";

export const attachPortfolioId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!req.userId) {
    throw new AppError("User not authenticated", 401, "NOT_AUTHENTICATED");
  }

  const portfolio = await portfolioRepository.findByUserId(req.userId);

  if (!portfolio) {
    throw new AppError("Portfolio not found", 404, "PORTFOLIO_NOT_FOUND");
  }

  req.portfolioId = portfolio.id;
  next();
};
