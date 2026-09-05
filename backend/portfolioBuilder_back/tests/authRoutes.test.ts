import assert from "node:assert/strict";
import { describe, it } from "node:test";
import express from "express";
import request from "supertest";

import { errorHandler } from "../src/middleware/errorHandler.js";
import { authRouter } from "../src/routes/authRoutes.js";

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/v1", authRouter);
  app.use(errorHandler);
  return app;
};

describe("POST /api/v1/auth/register", () => {
  it("rejects invalid input with the API error contract", async () => {
    const response = await request(createTestApp())
      .post("/api/v1/auth/register")
      .send({
        name: "",
        email: "not-email",
        password: "short",
      });

    assert.equal(response.status, 422);
    assert.equal(response.body.success, false);
    assert.equal(response.body.data, null);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });

  it("rejects malformed JSON with the API error contract", async () => {
    const response = await request(createTestApp())
      .post("/api/v1/auth/register")
      .set("Content-Type", "application/json")
      .send("{not-json");

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
    assert.equal(response.body.data, null);
    assert.equal(response.body.code, "INVALID_JSON");
  });
});
