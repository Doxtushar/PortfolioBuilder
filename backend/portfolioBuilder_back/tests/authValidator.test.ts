import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateRegisterInput } from "../src/validators/authValidator.js";
import { AppError } from "../src/utils/AppError.js";

describe("validateRegisterInput", () => {
  it("normalizes valid registration input", () => {
    const input = validateRegisterInput({
      name: "  John Doe  ",
      email: "  JOHN@Example.COM  ",
      password: "SecurePassword123",
    });

    assert.deepEqual(input, {
      name: "John Doe",
      email: "john@example.com",
      password: "SecurePassword123",
    });
  });

  it("rejects invalid input", () => {
    assert.throws(
      () =>
        validateRegisterInput({
          name: " ",
          email: "not-email",
          password: "short",
        }),
      (error) =>
        error instanceof AppError &&
        error.statusCode === 422 &&
        error.code === "VALIDATION_ERROR",
    );
  });
});
