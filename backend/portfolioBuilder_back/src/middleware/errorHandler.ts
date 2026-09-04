import type { ErrorRequestHandler } from "express";

import { isProduction } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      data: null,
      message: error.message,
      code: error.code,
    });
    return;
  }

  if (!isProduction) {
    console.error(error);
  }

  res.status(500).json({
    success: false,
    data: null,
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  });
};
