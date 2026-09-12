import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateCreateProjectInput } from "../src/validators/projectValidator.js";
import { AppError } from "../src/utils/AppError.js";

describe("validateCreateProjectInput", () => {
  it("normalizes valid project input", () => {
    const input = validateCreateProjectInput({
      title: "  My Project  ",
      description: "  A description  ",
      technologies: "  React, TypeScript  ",
      projectUrl: "  https://example.com  ",
      githubUrl: "  https://github.com/user/repo  ",
      imageUrl: "  https://example.com/image.jpg  ",
    });

    assert.deepEqual(input, {
      title: "My Project",
      description: "A description",
      technologies: "React, TypeScript",
      projectUrl: "https://example.com",
      githubUrl: "https://github.com/user/repo",
      imageUrl: "https://example.com/image.jpg",
    });
  });

  it("accepts project with only required fields", () => {
    const input = validateCreateProjectInput({
      title: "My Project",
    });

    assert.deepEqual(input, {
      title: "My Project",
    });
  });

  it("rejects input without title", () => {
    assert.throws(
      () =>
        validateCreateProjectInput({
          description: "A description",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input with empty title", () => {
    assert.throws(
      () =>
        validateCreateProjectInput({
          title: "  ",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects non-object input", () => {
    assert.throws(
      () => validateCreateProjectInput(null),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("handles empty optional fields correctly", () => {
    const input = validateCreateProjectInput({
      title: "My Project",
      description: "  ",
      technologies: "",
    });

    assert.deepEqual(input, {
      title: "My Project",
    });
  });
});
