import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { createProjectService } from "../src/services/projectService.js";
import { AppError } from "../src/utils/AppError.js";
import type { ProjectRecord } from "../src/repositories/projectRepository.js";

describe("projectService", () => {
  const mockProjectRecord: ProjectRecord = {
    id: "project-123",
    portfolioId: "portfolio-123",
    title: "Test Project",
    description: "A test project",
    technologies: "React, TypeScript",
    projectUrl: "https://example.com",
    githubUrl: "https://github.com/user/repo",
    imageUrl: "https://example.com/image.jpg",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  };

  describe("createProject", () => {
    it("creates a project successfully", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockProjectRecord),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(),
        delete: mock.fn(),
      };

      const service = createProjectService({ repository: mockRepository });
      const project = await service.createProject("portfolio-123", {
        title: "Test Project",
        description: "A test project",
      });

      assert.equal(project.title, "Test Project");
      assert.equal(project.description, "A test project");
      assert.equal(mockRepository.create.mock.calls.length, 1);
    });
  });

  describe("getProjects", () => {
    it("returns all projects for a portfolio", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(async () => [mockProjectRecord]),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(),
        delete: mock.fn(),
      };

      const service = createProjectService({ repository: mockRepository });
      const projects = await service.getProjects("portfolio-123");

      assert.equal(projects.length, 1);
      assert.equal(projects[0].title, "Test Project");
      assert.equal(mockRepository.findByPortfolioId.mock.calls.length, 1);
    });
  });

  describe("getProject", () => {
    it("returns a project by id", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(async () => mockProjectRecord),
        update: mock.fn(),
        delete: mock.fn(),
      };

      const service = createProjectService({ repository: mockRepository });
      const project = await service.getProject("project-123", "portfolio-123");

      assert.equal(project.id, "project-123");
      assert.equal(mockRepository.findByIdAndPortfolioId.mock.calls.length, 1);
    });

    it("throws error when project not found", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(async () => null),
        update: mock.fn(),
        delete: mock.fn(),
      };

      const service = createProjectService({ repository: mockRepository });

      await assert.rejects(
        () => service.getProject("project-123", "portfolio-123"),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "PROJECT_NOT_FOUND",
      );
    });
  });

  describe("updateProject", () => {
    it("updates a project successfully", async () => {
      const updatedRecord = { ...mockProjectRecord, title: "Updated Project" };
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(async () => updatedRecord),
        delete: mock.fn(),
      };

      const service = createProjectService({ repository: mockRepository });
      const project = await service.updateProject("project-123", "portfolio-123", {
        title: "Updated Project",
      });

      assert.equal(project.title, "Updated Project");
      assert.equal(mockRepository.update.mock.calls.length, 1);
    });

    it("throws error when project not found", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(async () => null),
        delete: mock.fn(),
      };

      const service = createProjectService({ repository: mockRepository });

      await assert.rejects(
        () => service.updateProject("project-123", "portfolio-123", { title: "Updated" }),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "PROJECT_NOT_FOUND",
      );
    });
  });

  describe("deleteProject", () => {
    it("deletes a project successfully", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(),
        delete: mock.fn(async () => true),
      };

      const service = createProjectService({ repository: mockRepository });
      await service.deleteProject("project-123", "portfolio-123");

      assert.equal(mockRepository.delete.mock.calls.length, 1);
    });

    it("throws error when project not found", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(),
        delete: mock.fn(async () => false),
      };

      const service = createProjectService({ repository: mockRepository });

      await assert.rejects(
        () => service.deleteProject("project-123", "portfolio-123"),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "PROJECT_NOT_FOUND",
      );
    });
  });
});
