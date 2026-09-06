import { AppError } from "../utils/AppError.js";
import type { LoginUserInput, RegisterUserInput } from "../types/auth.js";

const MIN_PASSWORD_LENGTH = 12;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const validateRegisterInput = (body: unknown): RegisterUserInput => {
  if (!isRecord(body)) {
    throw new AppError("Request body must be a JSON object", 422, "VALIDATION_ERROR");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name) {
    throw new AppError("Name is required", 422, "VALIDATION_ERROR");
  }

  if (!email || !isValidEmail(email)) {
    throw new AppError("A valid email is required", 422, "VALIDATION_ERROR");
  }

  if (!password) {
    throw new AppError("Password is required", 422, "VALIDATION_ERROR");
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      422,
      "VALIDATION_ERROR",
    );
  }

  return { name, email, password };
};

export const validateLoginInput = (body: unknown): LoginUserInput => {
  if (!isRecord(body)) {
    throw new AppError("Request body must be a JSON object", 422, "VALIDATION_ERROR");
  }

  const email =
    typeof body.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !isValidEmail(email)) {
    throw new AppError("A valid email is required", 422, "VALIDATION_ERROR");
  }

  if (!password) {
    throw new AppError("Password is required", 422, "VALIDATION_ERROR");
  }

  return { email, password };
};
