import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { createSkillService } from "../src/services/skillService.js";
import { AppError } from "../src/utils/AppError.js";
import type { SkillRecord } from "../src/repositories/skillRepository.js";

describe("skillService", () => {
  const mockSkillRecord: SkillRecord = {
    id: "skill-123",
    portfolio_id: "portfolio-123",
    name: "JavaScript",
    category: "Programming",
    proficiency: 85,
    display_order: 1,
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
  };

  describe("createSkill", () => {
    it("creates a skill successfully", async () => {
      const mockRepository = {
        create: mock.fn(async () => mockSkillRecord),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(),
        delete: mock.fn(),
      };

      const service = createSkillService({ repository: mockRepository });
      const skill = await service.createSkill("portfolio-123", {
        name: "JavaScript",
        category: "Programming",
        proficiency: 85,
      });

      assert.equal(skill.name, "JavaScript");
      assert.equal(skill.category, "Programming");
      assert.equal(skill.proficiency, 85);
      assert.equal(mockRepository.create.mock.calls.length, 1);
    });
  });

  describe("getSkills", () => {
    it("returns all skills for a portfolio", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(async () => [mockSkillRecord]),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(),
        delete: mock.fn(),
      };

      const service = createSkillService({ repository: mockRepository });
      const skills = await service.getSkills("portfolio-123");

      assert.equal(skills.length, 1);
      assert.equal(skills[0].name, "JavaScript");
      assert.equal(mockRepository.findByPortfolioId.mock.calls.length, 1);
    });
  });

  describe("getSkill", () => {
    it("returns a skill by id", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(async () => mockSkillRecord),
        update: mock.fn(),
        delete: mock.fn(),
      };

      const service = createSkillService({ repository: mockRepository });
      const skill = await service.getSkill("skill-123", "portfolio-123");

      assert.equal(skill.id, "skill-123");
      assert.equal(mockRepository.findByIdAndPortfolioId.mock.calls.length, 1);
    });

    it("throws error when skill not found", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(async () => null),
        update: mock.fn(),
        delete: mock.fn(),
      };

      const service = createSkillService({ repository: mockRepository });

      await assert.rejects(
        () => service.getSkill("skill-123", "portfolio-123"),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "SKILL_NOT_FOUND",
      );
    });
  });

  describe("updateSkill", () => {
    it("updates a skill successfully", async () => {
      const updatedRecord = { ...mockSkillRecord, name: "TypeScript", proficiency: 90 };
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(async () => updatedRecord),
        delete: mock.fn(),
      };

      const service = createSkillService({ repository: mockRepository });
      const skill = await service.updateSkill("skill-123", "portfolio-123", {
        name: "TypeScript",
        proficiency: 90,
      });

      assert.equal(skill.name, "TypeScript");
      assert.equal(skill.proficiency, 90);
      assert.equal(mockRepository.update.mock.calls.length, 1);
    });

    it("throws error when skill not found", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(async () => null),
        delete: mock.fn(),
      };

      const service = createSkillService({ repository: mockRepository });

      await assert.rejects(
        () => service.updateSkill("skill-123", "portfolio-123", { name: "Updated" }),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "SKILL_NOT_FOUND",
      );
    });
  });

  describe("deleteSkill", () => {
    it("deletes a skill successfully", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(),
        delete: mock.fn(async () => true),
      };

      const service = createSkillService({ repository: mockRepository });
      await service.deleteSkill("skill-123", "portfolio-123");

      assert.equal(mockRepository.delete.mock.calls.length, 1);
    });

    it("throws error when skill not found", async () => {
      const mockRepository = {
        create: mock.fn(),
        findByPortfolioId: mock.fn(),
        findByIdAndPortfolioId: mock.fn(),
        update: mock.fn(),
        delete: mock.fn(async () => false),
      };

      const service = createSkillService({ repository: mockRepository });

      await assert.rejects(
        () => service.deleteSkill("skill-123", "portfolio-123"),
        (error) =>
          error instanceof AppError &&
          error.statusCode === 404 &&
          error.code === "SKILL_NOT_FOUND",
      );
    });
  });
});
