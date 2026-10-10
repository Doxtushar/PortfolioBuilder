import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { createCertificationService } from "../src/services/certificationService.js";
import { AppError } from "../src/utils/AppError.js";
import type { Certification } from "../src/types/certification.js";

describe("certificationService", () => {
  const mockCertification: Certification = {
    id: "cert-123",
    portfolioId: "portfolio-123",
    name: "AWS Certified Solutions Architect",
    issuingOrganization: "Amazon Web Services",
    issueDate: "2023-01-15",
    expirationDate: "2026-01-15",
    credentialId: "AWS-ASA-12345",
    credentialUrl: "https://aws.amazon.com/verify",
    description: "Certification description",
    displayOrder: 0,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  };

  describe("createCertification", () => {
    it("creates a certification successfully", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockCertification),
        findByPortfolioId: mock.fn(async () => [mockCertification]),
        findByIdAndPortfolioId: mock.fn(async () => mockCertification),
        update: mock.fn(async () => mockCertification),
        delete: mock.fn(async () => true),
      };

      const service = createCertificationService({ repository: mockRepository });
      const certification = await service.createCertification("portfolio-123", {
        name: "AWS Certified Solutions Architect",
        issuingOrganization: "Amazon Web Services",
      });

      assert.equal(certification.name, "AWS Certified Solutions Architect");
      assert.equal(certification.issuingOrganization, "Amazon Web Services");
      assert.equal(mockRepository.create.mock.calls.length, 1);
    });
  });

  describe("getCertifications", () => {
    it("returns all certifications for a portfolio", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockCertification),
        findByPortfolioId: mock.fn(async () => [mockCertification]),
        findByIdAndPortfolioId: mock.fn(async () => mockCertification),
        update: mock.fn(async () => mockCertification),
        delete: mock.fn(async () => true),
      };

      const service = createCertificationService({ repository: mockRepository });
      const certifications = await service.getCertifications("portfolio-123");

      assert.equal(certifications.length, 1);
      assert.equal(certifications[0].name, "AWS Certified Solutions Architect");
      assert.equal(mockRepository.findByPortfolioId.mock.calls.length, 1);
    });
  });

  describe("getCertificationById", () => {
    it("returns a certification by id", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockCertification),
        findByPortfolioId: mock.fn(async () => [mockCertification]),
        findByIdAndPortfolioId: mock.fn(async () => mockCertification),
        update: mock.fn(async () => mockCertification),
        delete: mock.fn(async () => true),
      };

      const service = createCertificationService({ repository: mockRepository });
      const certification = await service.getCertificationById("cert-123", "portfolio-123");

      assert.equal(certification.id, "cert-123");
      assert.equal(mockRepository.findByIdAndPortfolioId.mock.calls.length, 1);
    });

    it("throws error when certification not found", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockCertification),
        findByPortfolioId: mock.fn(async () => [mockCertification]),
        findByIdAndPortfolioId: mock.fn(async () => null),
        update: mock.fn(async () => mockCertification),
        delete: mock.fn(async () => true),
      };

      const service = createCertificationService({ repository: mockRepository });

      await assert.rejects(
        () => service.getCertificationById("cert-123", "portfolio-123"),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "CERTIFICATION_NOT_FOUND",
      );
    });
  });

  describe("updateCertification", () => {
    it("updates a certification successfully", async () => {
      const updatedCertification = { ...mockCertification, name: "Updated Name" };
      const mockRepository = {
        create: mock.fn(async () => mockCertification),
        findByPortfolioId: mock.fn(async () => [mockCertification]),
        findByIdAndPortfolioId: mock.fn(async () => mockCertification),
        update: mock.fn(async () => updatedCertification),
        delete: mock.fn(async () => true),
      };

      const service = createCertificationService({ repository: mockRepository });
      const certification = await service.updateCertification("cert-123", "portfolio-123", {
        name: "Updated Name",
      });

      assert.equal(certification.name, "Updated Name");
      assert.equal(mockRepository.update.mock.calls.length, 1);
    });

    it("throws error when certification not found", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockCertification),
        findByPortfolioId: mock.fn(async () => [mockCertification]),
        findByIdAndPortfolioId: mock.fn(async () => mockCertification),
        update: mock.fn(async () => null),
        delete: mock.fn(async () => true),
      };

      const service = createCertificationService({ repository: mockRepository });

      await assert.rejects(
        () => service.updateCertification("cert-123", "portfolio-123", { name: "Updated" }),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "CERTIFICATION_NOT_FOUND",
      );
    });
  });

  describe("deleteCertification", () => {
    it("deletes a certification successfully", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockCertification),
        findByPortfolioId: mock.fn(async () => [mockCertification]),
        findByIdAndPortfolioId: mock.fn(async () => mockCertification),
        update: mock.fn(async () => mockCertification),
        delete: mock.fn(async () => true),
      };

      const service = createCertificationService({ repository: mockRepository });
      await service.deleteCertification("cert-123", "portfolio-123");

      assert.equal(mockRepository.delete.mock.calls.length, 1);
    });

    it("throws error when certification not found", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockCertification),
        findByPortfolioId: mock.fn(async () => [mockCertification]),
        findByIdAndPortfolioId: mock.fn(async () => mockCertification),
        update: mock.fn(async () => mockCertification),
        delete: mock.fn(async () => false),
      };

      const service = createCertificationService({ repository: mockRepository });

      await assert.rejects(
        () => service.deleteCertification("cert-123", "portfolio-123"),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "CERTIFICATION_NOT_FOUND",
      );
    });
  });
});
