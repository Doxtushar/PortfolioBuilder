import type { CreateProjectInput, UpdateProjectInput } from "../types/project.js";
import { AppError } from "../utils/AppError.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const validateProjectInput = (body: unknown): CreateProjectInput => {
  if (!isRecord(body)) {
    throw new AppError("Request body must be a JSON object", 422, "VALIDATION_ERROR");
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : null;
  const technologies = typeof body.technologies === "string" ? body.technologies.trim() : null;
  const projectUrl = typeof body.projectUrl === "string" ? body.projectUrl.trim() : null;
  const githubUrl = typeof body.githubUrl === "string" ? body.githubUrl.trim() : null;
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : null;

  if (!title) {
    throw new AppError("Title is required", 422, "VALIDATION_ERROR");
  }

  const result: CreateProjectInput = { title };

  if (description) {
    result.description = description;
  }
  if (technologies) {
    result.technologies = technologies;
  }
  if (projectUrl) {
    result.projectUrl = projectUrl;
  }
  if (githubUrl) {
    result.githubUrl = githubUrl;
  }
  if (imageUrl) {
    result.imageUrl = imageUrl;
  }

  return result;
};

export const validateCreateProjectInput = (body: unknown): CreateProjectInput =>
  validateProjectInput(body);

export const validateUpdateProjectInput = (body: unknown): UpdateProjectInput =>
  validateProjectInput(body);
