import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateCreateExperienceInput } from "../src/validators/experienceValidator.js";
import { AppError } from "../src/utils/AppError.js";

describe("validateCreateExperienceInput", () => {
  it("normalizes valid experience input", () => {
    const input = validateCreateExperienceInput({
      companyName: "  Acme Corp  ",
      jobTitle: "  Software Engineer  ",
      employmentType: "  Full-time  ",
      location: "  San Francisco  ",
      startDate: "2020-01-01",
      endDate: "2022-12-31",
      isCurrent: false,
      description: "  Work description  ",
    });

    assert.deepEqual(input, {
      companyName: "Acme Corp",
      jobTitle: "Software Engineer",
      employmentType: "Full-time",
      location: "San Francisco",
      startDate: "2020-01-01",
      endDate: "2022-12-31",
      isCurrent: false,
      description: "Work description",
    });
  });

  it("accepts experience with only required fields", () => {
    const input = validateCreateExperienceInput({
      companyName: "Acme Corp",
      jobTitle: "Software Engineer",
      startDate: "2020-01-01",
    });

    assert.deepEqual(input, {
      companyName: "Acme Corp",
      jobTitle: "Software Engineer",
      startDate: "2020-01-01",
    });
  });

  it("rejects input without companyName", () => {
    assert.throws(
      () =>
        validateCreateExperienceInput({
          jobTitle: "Software Engineer",
          startDate: "2020-01-01",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input without jobTitle", () => {
    assert.throws(
      () =>
        validateCreateExperienceInput({
          companyName: "Acme Corp",
          startDate: "2020-01-01",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input without startDate", () => {
    assert.throws(
      () =>
        validateCreateExperienceInput({
          companyName: "Acme Corp",
          jobTitle: "Software Engineer",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input with empty companyName", () => {
    assert.throws(
      () =>
        validateCreateExperienceInput({
          companyName: "  ",
          jobTitle: "Software Engineer",
          startDate: "2020-01-01",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input with empty jobTitle", () => {
    assert.throws(
      () =>
        validateCreateExperienceInput({
          companyName: "Acme Corp",
          jobTitle: "  ",
          startDate: "2020-01-01",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects invalid startDate", () => {
    assert.throws(
      () =>
        validateCreateExperienceInput({
          companyName: "Acme Corp",
          jobTitle: "Software Engineer",
          startDate: "invalid",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects endDate before startDate", () => {
    assert.throws(
      () =>
        validateCreateExperienceInput({
          companyName: "Acme Corp",
          jobTitle: "Software Engineer",
          startDate: "2022-01-01",
          endDate: "2020-01-01",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects endDate when isCurrent is true", () => {
    assert.throws(
      () =>
        validateCreateExperienceInput({
          companyName: "Acme Corp",
          jobTitle: "Software Engineer",
          startDate: "2020-01-01",
          endDate: "2022-01-01",
          isCurrent: true,
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects non-object input", () => {
    assert.throws(
      () => validateCreateExperienceInput(null),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });
});
