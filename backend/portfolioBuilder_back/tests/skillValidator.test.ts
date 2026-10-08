import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateCreateSkillInput } from "../src/validators/skillValidator.js";
import { AppError } from "../src/utils/AppError.js";

describe("validateCreateSkillInput", () => {
  it("normalizes valid skill input", () => {
    const input = validateCreateSkillInput({
      name: "  JavaScript  ",
      category: "  Programming  ",
      proficiency: 85,
      displayOrder: 1,
    });

    assert.deepEqual(input, {
      name: "JavaScript",
      category: "Programming",
      proficiency: 85,
      displayOrder: 1,
    });
  });

  it("accepts skill with only required fields", () => {
    const input = validateCreateSkillInput({
      name: "React",
      category: "Frontend",
    });

    assert.deepEqual(input, {
      name: "React",
      category: "Frontend",
    });
  });

  it("rejects input without name", () => {
    assert.throws(
      () =>
        validateCreateSkillInput({
          category: "Programming",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input without category", () => {
    assert.throws(
      () =>
        validateCreateSkillInput({
          name: "JavaScript",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input with empty name", () => {
    assert.throws(
      () =>
        validateCreateSkillInput({
          name: "  ",
          category: "Programming",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input with empty category", () => {
    assert.throws(
      () =>
        validateCreateSkillInput({
          name: "JavaScript",
          category: "  ",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects proficiency out of range", () => {
    assert.throws(
      () =>
        validateCreateSkillInput({
          name: "JavaScript",
          category: "Programming",
          proficiency: 150,
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects negative proficiency", () => {
    assert.throws(
      () =>
        validateCreateSkillInput({
          name: "JavaScript",
          category: "Programming",
          proficiency: -10,
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects non-object input", () => {
    assert.throws(
      () => validateCreateSkillInput(null),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });
});
