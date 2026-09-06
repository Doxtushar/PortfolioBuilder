import type { Request, Response } from "express";

import { authService } from "../services/authService.js";
import type { LoginResult, RegistrationResult } from "../types/auth.js";
import type { ApiResponse } from "../types/apiResponse.js";
import { validateLoginInput, validateRegisterInput } from "../validators/authValidator.js";

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

export const login = async (
  req: Request,
  res: Response<ApiResponse<LoginResult>>,
) => {
  const input = validateLoginInput(req.body);
  const login = await authService.loginUser(input);

  res.status(200).json({
    success: true,
    data: login,
    message: "Login successful",
  });
};
