import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

declare module "express" {
  interface Request {
    userId?: string;
    userEmail?: string;
    portfolioId?: string;
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authorization header is missing or invalid", 401, "MISSING_AUTH_HEADER");
  }

  const token = authHeader.substring(7);

  if (!env.jwtSecret) {
    throw new AppError("JWT secret is not configured", 500, "JWT_SECRET_NOT_CONFIGURED");
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string; email: string };

    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Token has expired", 401, "TOKEN_EXPIRED");
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token", 401, "INVALID_TOKEN");
    }

    throw error;
  }
};
