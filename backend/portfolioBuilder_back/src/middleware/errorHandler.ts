import type { ErrorRequestHandler } from "express";

import { isProduction } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const isJsonParseError = (error: unknown): boolean =>
  error instanceof SyntaxError &&
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  error.status === 400 &&
  "body" in error;

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

  if (isJsonParseError(error)) {
    res.status(400).json({
      success: false,
      data: null,
      message: "Request body contains invalid JSON",
      code: "INVALID_JSON",
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
