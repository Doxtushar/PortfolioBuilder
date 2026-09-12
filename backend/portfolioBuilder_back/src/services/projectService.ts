import {
  projectRepository,
  type ProjectRepository,
} from "../repositories/projectRepository.js";
import type { CreateProjectInput, Project, UpdateProjectInput } from "../types/project.js";
import { AppError } from "../utils/AppError.js";

const toProject = (project: Awaited<ReturnType<ProjectRepository["create"]>>): Project => ({
  id: project.id,
  portfolioId: project.portfolioId,
  title: project.title,
  description: project.description,
  technologies: project.technologies,
  projectUrl: project.projectUrl,
  githubUrl: project.githubUrl,
  imageUrl: project.imageUrl,
  createdAt: project.createdAt.toISOString(),
  updatedAt: project.updatedAt.toISOString(),
});

type ProjectServiceDependencies = {
  repository?: ProjectRepository;
};

export const createProjectService = ({
  repository = projectRepository,
}: ProjectServiceDependencies = {}) => ({
  async createProject(portfolioId: string, input: CreateProjectInput): Promise<Project> {
    return toProject(await repository.create(portfolioId, input));
  },

  async getProjects(portfolioId: string): Promise<Project[]> {
    const projects = await repository.findByPortfolioId(portfolioId);
    return projects.map(toProject);
  },

  async getProject(id: string, portfolioId: string): Promise<Project> {
    const project = await repository.findByIdAndPortfolioId(id, portfolioId);

    if (!project) {
      throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
    }

    return toProject(project);
  },

  async updateProject(id: string, portfolioId: string, input: UpdateProjectInput): Promise<Project> {
    const project = await repository.update(id, portfolioId, input);

    if (!project) {
      throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
    }

    return toProject(project);
  },

  async deleteProject(id: string, portfolioId: string): Promise<void> {
    const deleted = await repository.delete(id, portfolioId);

    if (!deleted) {
      throw new AppError("Project not found", 404, "PROJECT_NOT_FOUND");
    }
  },
});

export const projectService = createProjectService();
