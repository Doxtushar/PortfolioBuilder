import type { Request, Response } from "express";

import { authService } from "../services/authService.js";
import type { RegistrationResult } from "../types/auth.js";
import type { ApiResponse } from "../types/apiResponse.js";
import { validateRegisterInput } from "../validators/authValidator.js";

export const register = async (
  req: Request,
  res: Response<ApiResponse<RegistrationResult>>,
) => {
  const input = validateRegisterInput(req.body);
  const registration = await authService.registerUser(input);

  res.status(201).json({
    success: true,
    data: registration,
    message: "Registration successful",
  });
};
