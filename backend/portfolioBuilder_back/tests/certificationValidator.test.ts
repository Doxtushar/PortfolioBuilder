import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateCreateCertificationInput } from "../src/validators/certificationValidator.js";
import { AppError } from "../src/utils/AppError.js";

describe("validateCreateCertificationInput", () => {
  it("normalizes valid certification input", () => {
    const input = validateCreateCertificationInput({
      name: "  AWS Certified Solutions Architect  ",
      issuingOrganization: "  Amazon Web Services  ",
      issueDate: "2023-01-15",
      expirationDate: "2026-01-15",
      credentialId: "  AWS-ASA-12345  ",
      credentialUrl: "  https://aws.amazon.com/verify  ",
      description: "  Certification description  ",
      displayOrder: 0,
    });

    assert.deepEqual(input, {
      name: "AWS Certified Solutions Architect",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2023-01-15",
      expirationDate: "2026-01-15",
      credentialId: "AWS-ASA-12345",
      credentialUrl: "https://aws.amazon.com/verify",
      description: "Certification description",
      displayOrder: 0,
    });
  });

  it("accepts certification with only required fields", () => {
    const input = validateCreateCertificationInput({
      name: "AWS Certified Solutions Architect",
      issuingOrganization: "Amazon Web Services",
    });

    assert.deepEqual(input, {
      name: "AWS Certified Solutions Architect",
      issuingOrganization: "Amazon Web Services",
    });
  });

  it("rejects input without name", () => {
    assert.throws(
      () =>
        validateCreateCertificationInput({
          issuingOrganization: "Amazon Web Services",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input without issuingOrganization", () => {
    assert.throws(
      () =>
        validateCreateCertificationInput({
          name: "AWS Certified Solutions Architect",
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
        validateCreateCertificationInput({
          name: "  ",
          issuingOrganization: "Amazon Web Services",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects input with empty issuingOrganization", () => {
    assert.throws(
      () =>
        validateCreateCertificationInput({
          name: "AWS Certified Solutions Architect",
          issuingOrganization: "  ",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects invalid issueDate", () => {
    assert.throws(
      () =>
        validateCreateCertificationInput({
          name: "AWS Certified Solutions Architect",
          issuingOrganization: "Amazon Web Services",
          issueDate: "invalid",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects invalid expirationDate", () => {
    assert.throws(
      () =>
        validateCreateCertificationInput({
          name: "AWS Certified Solutions Architect",
          issuingOrganization: "Amazon Web Services",
          expirationDate: "invalid",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects expirationDate before issueDate", () => {
    assert.throws(
      () =>
        validateCreateCertificationInput({
          name: "AWS Certified Solutions Architect",
          issuingOrganization: "Amazon Web Services",
          issueDate: "2026-01-01",
          expirationDate: "2023-01-01",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects invalid credentialUrl", () => {
    assert.throws(
      () =>
        validateCreateCertificationInput({
          name: "AWS Certified Solutions Architect",
          issuingOrganization: "Amazon Web Services",
          credentialUrl: "not-a-url",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });

  it("rejects non-object input", () => {
    assert.throws(
      () => validateCreateCertificationInput(null),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });
});
