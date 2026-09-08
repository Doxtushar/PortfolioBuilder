import type { CreatePortfolioInput, UpdatePortfolioInput } from "../types/portfolio.js";
import { AppError } from "../utils/AppError.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const validatePortfolioInput = (body: unknown): CreatePortfolioInput => {
  if (!isRecord(body)) {
    throw new AppError("Request body must be a JSON object", 422, "VALIDATION_ERROR");
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const bio = typeof body.bio === "string" ? body.bio.trim() : null;

  if (!username) {
    throw new AppError("Username is required", 422, "VALIDATION_ERROR");
  }

  if (!title) {
    throw new AppError("Title is required", 422, "VALIDATION_ERROR");
  }

  const result: CreatePortfolioInput = { username, title, bio };

  if (typeof body.fullName === "string" && body.fullName.trim()) {
    result.fullName = body.fullName.trim();
  }
  if (typeof body.headline === "string" && body.headline.trim()) {
    result.headline = body.headline.trim();
  }
  if (typeof body.location === "string" && body.location.trim()) {
    result.location = body.location.trim();
  }
  if (typeof body.introduction === "string" && body.introduction.trim()) {
    result.introduction = body.introduction.trim();
  }
  if (typeof body.profileImageUrl === "string" && body.profileImageUrl.trim()) {
    result.profileImageUrl = body.profileImageUrl.trim();
  }

  return result;
};

export const validateCreatePortfolioInput = (body: unknown): CreatePortfolioInput =>
  validatePortfolioInput(body);

export const validateUpdatePortfolioInput = (body: unknown): UpdatePortfolioInput =>
  validatePortfolioInput(body);
