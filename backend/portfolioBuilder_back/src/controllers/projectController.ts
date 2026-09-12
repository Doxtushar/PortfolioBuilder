import type { Request, Response } from "express";

import { projectService } from "../services/projectService.js";
import type { ApiResponse } from "../types/apiResponse.js";
import type { Project } from "../types/project.js";
import {
  validateCreateProjectInput,
  validateUpdateProjectInput,
} from "../validators/projectValidator.js";

const getPortfolioId = (req: Request): string => {
  if (!req.portfolioId) {
    throw new Error("Portfolio ID not found in request");
  }

  return req.portfolioId;
};

export const createProject = async (
  req: Request,
  res: Response<ApiResponse<Project>>,
) => {
  const project = await projectService.createProject(
    getPortfolioId(req),
    validateCreateProjectInput(req.body),
  );

  res.status(201).json({
    success: true,
    data: project,
    message: "Project created successfully",
  });
};

export const getProjects = async (
  req: Request,
  res: Response<ApiResponse<Project[]>>,
) => {
  const projects = await projectService.getProjects(getPortfolioId(req));

  res.status(200).json({
    success: true,
    data: projects,
    message: "Projects retrieved successfully",
  });
};

export const getProject = async (
  req: Request,
  res: Response<ApiResponse<Project>>,
) => {
  const id = req.params.id as string;
  const project = await projectService.getProject(id, getPortfolioId(req));

  res.status(200).json({
    success: true,
    data: project,
    message: "Project retrieved successfully",
  });
};

export const updateProject = async (
  req: Request,
  res: Response<ApiResponse<Project>>,
) => {
  const id = req.params.id as string;
  const project = await projectService.updateProject(
    id,
    getPortfolioId(req),
    validateUpdateProjectInput(req.body),
  );

  res.status(200).json({
    success: true,
    data: project,
    message: "Project updated successfully",
  });
};

export const deleteProject = async (req: Request, res: Response<ApiResponse<null>>) => {
  const id = req.params.id as string;
  await projectService.deleteProject(id, getPortfolioId(req));

  res.status(200).json({
    success: true,
    data: null,
    message: "Project deleted successfully",
  });
};
