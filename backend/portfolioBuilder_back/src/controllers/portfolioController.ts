import type { Request, Response } from "express";

import { portfolioService } from "../services/portfolioService.js";
import type { ApiResponse } from "../types/apiResponse.js";
import type { Portfolio } from "../types/portfolio.js";
import {
  validateCreatePortfolioInput,
  validateUpdatePortfolioInput,
} from "../validators/portfolioValidator.js";

const getUserId = (req: Request): string => {
  if (!req.userId) {
    throw new Error("User ID not found in request");
  }

  return req.userId;
};

export const createPortfolio = async (
  req: Request,
  res: Response<ApiResponse<Portfolio>>,
) => {
  const portfolio = await portfolioService.createPortfolio(
    getUserId(req),
    validateCreatePortfolioInput(req.body),
  );

  res.status(201).json({
    success: true,
    data: portfolio,
    message: "Portfolio created successfully",
  });
};

export const getPortfolio = async (
  req: Request,
  res: Response<ApiResponse<Portfolio>>,
) => {
  const portfolio = await portfolioService.getPortfolio(getUserId(req));

  res.status(200).json({
    success: true,
    data: portfolio,
    message: "Portfolio retrieved successfully",
  });
};

export const updatePortfolio = async (
  req: Request,
  res: Response<ApiResponse<Portfolio>>,
) => {
  const portfolio = await portfolioService.updatePortfolio(
    getUserId(req),
    validateUpdatePortfolioInput(req.body),
  );

  res.status(200).json({
    success: true,
    data: portfolio,
    message: "Portfolio updated successfully",
  });
};
