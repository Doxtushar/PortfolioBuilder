import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { createEducationService } from "../src/services/educationService.js";
import { AppError } from "../src/utils/AppError.js";
import type { Education } from "../src/types/education.js";

describe("educationService", () => {
  const mockEducation: Education = {
    id: "education-123",
    portfolioId: "portfolio-123",
    institution: "Stanford University",
    degree: "Bachelor of Science",
    fieldOfStudy: "Computer Science",
    location: "Stanford, CA",
    startDate: "2018-09-01",
    endDate: "2022-05-31",
    isCurrent: false,
    description: "Education description",
    displayOrder: 0,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  };

  describe("createEducation", () => {
    it("creates an education successfully", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockEducation),
        findByPortfolioId: mock.fn(async () => [mockEducation]),
        findByIdAndPortfolioId: mock.fn(async () => mockEducation),
        update: mock.fn(async () => mockEducation),
        delete: mock.fn(async () => true),
      };

      const service = createEducationService({ repository: mockRepository });
      const education = await service.createEducation("portfolio-123", {
        institution: "Stanford University",
        degree: "Bachelor of Science",
        startDate: "2018-09-01",
      });

      assert.equal(education.institution, "Stanford University");
      assert.equal(education.degree, "Bachelor of Science");
      assert.equal(mockRepository.create.mock.calls.length, 1);
    });
  });

  describe("getEducation", () => {
    it("returns all education for a portfolio", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockEducation),
        findByPortfolioId: mock.fn(async () => [mockEducation]),
        findByIdAndPortfolioId: mock.fn(async () => mockEducation),
        update: mock.fn(async () => mockEducation),
        delete: mock.fn(async () => true),
      };

      const service = createEducationService({ repository: mockRepository });
      const education = await service.getEducation("portfolio-123");

      assert.equal(education.length, 1);
      assert.equal(education[0].institution, "Stanford University");
      assert.equal(mockRepository.findByPortfolioId.mock.calls.length, 1);
    });
  });

  describe("getEducationById", () => {
    it("returns an education by id", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockEducation),
        findByPortfolioId: mock.fn(async () => [mockEducation]),
        findByIdAndPortfolioId: mock.fn(async () => mockEducation),
        update: mock.fn(async () => mockEducation),
        delete: mock.fn(async () => true),
      };

      const service = createEducationService({ repository: mockRepository });
      const education = await service.getEducationById("education-123", "portfolio-123");

      assert.equal(education.id, "education-123");
      assert.equal(mockRepository.findByIdAndPortfolioId.mock.calls.length, 1);
    });

    it("throws error when education not found", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockEducation),
        findByPortfolioId: mock.fn(async () => [mockEducation]),
        findByIdAndPortfolioId: mock.fn(async () => null),
        update: mock.fn(async () => mockEducation),
        delete: mock.fn(async () => true),
      };

      const service = createEducationService({ repository: mockRepository });

      await assert.rejects(
        () => service.getEducationById("education-123", "portfolio-123"),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "EDUCATION_NOT_FOUND",
      );
    });
  });

  describe("updateEducation", () => {
    it("updates an education successfully", async () => {
      const updatedEducation = { ...mockEducation, institution: "MIT" };
      const mockRepository = {
        create: mock.fn(async () => mockEducation),
        findByPortfolioId: mock.fn(async () => [mockEducation]),
        findByIdAndPortfolioId: mock.fn(async () => mockEducation),
        update: mock.fn(async () => updatedEducation),
        delete: mock.fn(async () => true),
      };

      const service = createEducationService({ repository: mockRepository });
      const education = await service.updateEducation("education-123", "portfolio-123", {
        institution: "MIT",
      });

      assert.equal(education.institution, "MIT");
      assert.equal(mockRepository.update.mock.calls.length, 1);
    });

    it("throws error when education not found", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockEducation),
        findByPortfolioId: mock.fn(async () => [mockEducation]),
        findByIdAndPortfolioId: mock.fn(async () => mockEducation),
        update: mock.fn(async () => null),
        delete: mock.fn(async () => true),
      };

      const service = createEducationService({ repository: mockRepository });

      await assert.rejects(
        () => service.updateEducation("education-123", "portfolio-123", { institution: "Updated" }),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "EDUCATION_NOT_FOUND",
      );
    });
  });

  describe("deleteEducation", () => {
    it("deletes an education successfully", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockEducation),
        findByPortfolioId: mock.fn(async () => [mockEducation]),
        findByIdAndPortfolioId: mock.fn(async () => mockEducation),
        update: mock.fn(async () => mockEducation),
        delete: mock.fn(async () => true),
      };

      const service = createEducationService({ repository: mockRepository });
      await service.deleteEducation("education-123", "portfolio-123");

      assert.equal(mockRepository.delete.mock.calls.length, 1);
    });

    it("throws error when education not found", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockEducation),
        findByPortfolioId: mock.fn(async () => [mockEducation]),
        findByIdAndPortfolioId: mock.fn(async () => mockEducation),
        update: mock.fn(async () => mockEducation),
        delete: mock.fn(async () => false),
      };

      const service = createEducationService({ repository: mockRepository });

      await assert.rejects(
        () => service.deleteEducation("education-123", "portfolio-123"),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "EDUCATION_NOT_FOUND",
      );
    });
  });
});
