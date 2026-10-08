import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { createExperienceService } from "../src/services/experienceService.js";
import { AppError } from "../src/utils/AppError.js";
import type { Experience } from "../src/types/experience.js";

describe("experienceService", () => {
  const mockExperience: Experience = {
    id: "experience-123",
    portfolioId: "portfolio-123",
    companyName: "Acme Corp",
    jobTitle: "Software Engineer",
    employmentType: "Full-time",
    location: "San Francisco",
    startDate: "2020-01-01",
    endDate: "2022-12-31",
    isCurrent: false,
    description: "Work description",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  };

  describe("createExperience", () => {
    it("creates an experience successfully", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockExperience),
        findByPortfolioId: mock.fn(async () => [mockExperience]),
        findByIdAndPortfolioId: mock.fn(async () => mockExperience),
        update: mock.fn(async () => mockExperience),
        delete: mock.fn(async () => true),
      };

      const service = createExperienceService({ repository: mockRepository });
      const experience = await service.createExperience("portfolio-123", {
        companyName: "Acme Corp",
        jobTitle: "Software Engineer",
        startDate: "2020-01-01",
      });

      assert.equal(experience.companyName, "Acme Corp");
      assert.equal(experience.jobTitle, "Software Engineer");
      assert.equal(mockRepository.create.mock.calls.length, 1);
    });
  });

  describe("getExperiences", () => {
    it("returns all experiences for a portfolio", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockExperience),
        findByPortfolioId: mock.fn(async () => [mockExperience]),
        findByIdAndPortfolioId: mock.fn(async () => mockExperience),
        update: mock.fn(async () => mockExperience),
        delete: mock.fn(async () => true),
      };

      const service = createExperienceService({ repository: mockRepository });
      const experiences = await service.getExperiences("portfolio-123");

      assert.equal(experiences.length, 1);
      assert.equal(experiences[0].companyName, "Acme Corp");
      assert.equal(mockRepository.findByPortfolioId.mock.calls.length, 1);
    });
  });

  describe("getExperience", () => {
    it("returns an experience by id", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockExperience),
        findByPortfolioId: mock.fn(async () => [mockExperience]),
        findByIdAndPortfolioId: mock.fn(async () => mockExperience),
        update: mock.fn(async () => mockExperience),
        delete: mock.fn(async () => true),
      };

      const service = createExperienceService({ repository: mockRepository });
      const experience = await service.getExperience("experience-123", "portfolio-123");

      assert.equal(experience.id, "experience-123");
      assert.equal(mockRepository.findByIdAndPortfolioId.mock.calls.length, 1);
    });

    it("throws error when experience not found", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockExperience),
        findByPortfolioId: mock.fn(async () => [mockExperience]),
        findByIdAndPortfolioId: mock.fn(async () => null),
        update: mock.fn(async () => mockExperience),
        delete: mock.fn(async () => true),
      };

      const service = createExperienceService({ repository: mockRepository });

      await assert.rejects(
        () => service.getExperience("experience-123", "portfolio-123"),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "EXPERIENCE_NOT_FOUND",
      );
    });
  });

  describe("updateExperience", () => {
    it("updates an experience successfully", async () => {
      const updatedExperience = { ...mockExperience, companyName: "New Corp" };
      const mockRepository = {
        create: mock.fn(async () => mockExperience),
        findByPortfolioId: mock.fn(async () => [mockExperience]),
        findByIdAndPortfolioId: mock.fn(async () => mockExperience),
        update: mock.fn(async () => updatedExperience),
        delete: mock.fn(async () => true),
      };

      const service = createExperienceService({ repository: mockRepository });
      const experience = await service.updateExperience("experience-123", "portfolio-123", {
        companyName: "New Corp",
      });

      assert.equal(experience.companyName, "New Corp");
      assert.equal(mockRepository.update.mock.calls.length, 1);
    });

    it("throws error when experience not found", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockExperience),
        findByPortfolioId: mock.fn(async () => [mockExperience]),
        findByIdAndPortfolioId: mock.fn(async () => mockExperience),
        update: mock.fn(async () => null),
        delete: mock.fn(async () => true),
      };

      const service = createExperienceService({ repository: mockRepository });

      await assert.rejects(
        () => service.updateExperience("experience-123", "portfolio-123", { companyName: "Updated" }),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "EXPERIENCE_NOT_FOUND",
      );
    });
  });

  describe("deleteExperience", () => {
    it("deletes an experience successfully", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockExperience),
        findByPortfolioId: mock.fn(async () => [mockExperience]),
        findByIdAndPortfolioId: mock.fn(async () => mockExperience),
        update: mock.fn(async () => mockExperience),
        delete: mock.fn(async () => true),
      };

      const service = createExperienceService({ repository: mockRepository });
      await service.deleteExperience("experience-123", "portfolio-123");

      assert.equal(mockRepository.delete.mock.calls.length, 1);
    });

    it("throws error when experience not found", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockExperience),
        findByPortfolioId: mock.fn(async () => [mockExperience]),
        findByIdAndPortfolioId: mock.fn(async () => mockExperience),
        update: mock.fn(async () => mockExperience),
        delete: mock.fn(async () => false),
      };

      const service = createExperienceService({ repository: mockRepository });

      await assert.rejects(
        () => service.deleteExperience("experience-123", "portfolio-123"),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "EXPERIENCE_NOT_FOUND",
      );
    });
  });
});
