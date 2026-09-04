import type { Request, Response } from "express";

import { getHealthStatus } from "../services/healthService.js";
import type { ApiResponse } from "../types/apiResponse.js";

export const getHealth = async (
  _req: Request,
  res: Response<ApiResponse<Awaited<ReturnType<typeof getHealthStatus>>>>,
) => {
  const health = await getHealthStatus();

  res.status(200).json({
    success: true,
    data: health,
    message: "Service is healthy",
  });
};
