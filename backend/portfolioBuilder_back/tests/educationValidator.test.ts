import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateCreateEducationInput } from "../src/validators/educationValidator.js";
import { AppError } from "../src/utils/AppError.js";

describe("validateCreateEducationInput", () => {
  it("normalizes valid education input", () => {
    const input = validateCreateEducationInput({
      institution: "  Stanford University  ",
      degree: "  Bachelor of Science  ",
      fieldOfStudy: "  Computer Science  ",
      location: "  Stanford, CA  ",
      startDate: "2018-09-01",
      endDate: "2022-05-31",
      isCurrent: false,
      description: "  Education description  ",
      displayOrder: 0,
    });

    assert.deepEqual(input, {
      institution: "Stanford University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      location: "Stanford, CA",
      startDate: "2018-09-01",
      endDate: "2022-05-31",
      isCurrent: false,
      description: "Education description",
      displayOrder: 0,
    });
  });

  it("accepts education with only required fields", () => {
    const input = validateCreateEducationInput({
      institution: "Stanford University",
      degree: "Bachelor of Science",
      startDate: "2018-09-01",
    });

    assert.deepEqual(input, {
      institution: "Stanford University",
      degree: "Bachelor of Science",
      startDate: "2018-09-01",
    });
  });

  it("rejects input without institution", () => {
    assert.throws(
      () =>
        validateCreateEducationInput({
          degree: "Bachelor of Science",
          startDate: "2018-09-01",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input without degree", () => {
    assert.throws(
      () =>
        validateCreateEducationInput({
          institution: "Stanford University",
          startDate: "2018-09-01",
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
        validateCreateEducationInput({
          institution: "Stanford University",
          degree: "Bachelor of Science",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input with empty institution", () => {
    assert.throws(
      () =>
        validateCreateEducationInput({
          institution: "  ",
          degree: "Bachelor of Science",
          startDate: "2018-09-01",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input with empty degree", () => {
    assert.throws(
      () =>
        validateCreateEducationInput({
          institution: "Stanford University",
          degree: "  ",
          startDate: "2018-09-01",
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
        validateCreateEducationInput({
          institution: "Stanford University",
          degree: "Bachelor of Science",
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
        validateCreateEducationInput({
          institution: "Stanford University",
          degree: "Bachelor of Science",
          startDate: "2022-01-01",
          endDate: "2018-01-01",
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
        validateCreateEducationInput({
          institution: "Stanford University",
          degree: "Bachelor of Science",
          startDate: "2018-09-01",
          endDate: "2022-05-31",
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
      () => validateCreateEducationInput(null),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });
});
