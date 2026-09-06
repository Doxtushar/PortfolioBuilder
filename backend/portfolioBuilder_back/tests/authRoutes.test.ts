import assert from "node:assert/strict";
import { describe, it, before, after } from "node:test";
import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";

import { errorHandler } from "../src/middleware/errorHandler.js";
import { authRouter } from "../src/routes/authRoutes.js";
import { env } from "../src/config/env.js";

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

describe("POST /api/v1/auth/login", () => {
  it("rejects invalid input with the API error contract", async () => {
    const response = await request(createTestApp())
      .post("/api/v1/auth/login")
      .send({
        email: "not-email",
        password: "",
      });

    assert.equal(response.status, 422);
    assert.equal(response.body.success, false);
    assert.equal(response.body.data, null);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });

  it("rejects malformed JSON with the API error contract", async () => {
    const response = await request(createTestApp())
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send("{not-json");

    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
    assert.equal(response.body.data, null);
    assert.equal(response.body.code, "INVALID_JSON");
  });
});

describe("GET /api/v1/auth/me", () => {
  let originalJwtSecret: string | undefined;

  before(() => {
    originalJwtSecret = env.jwtSecret;
    env.jwtSecret = "test-secret";
  });

  after(() => {
    env.jwtSecret = originalJwtSecret;
  });

  it("rejects missing token with 401", async () => {
    const response = await request(createTestApp())
      .get("/api/v1/auth/me");

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.code, "MISSING_AUTH_HEADER");
  });

  it("rejects invalid token with 401", async () => {
    const response = await request(createTestApp())
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer invalid-token");

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.code, "INVALID_TOKEN");
  });

  it("rejects expired token with 401", async () => {
    const expiredToken = jwt.sign({ userId: "user-1", email: "john@example.com" }, "test-secret", { expiresIn: "-1h" } as jwt.SignOptions);

    const response = await request(createTestApp())
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${expiredToken}`);

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.code, "TOKEN_EXPIRED");
  });

  it("rejects malformed authorization header with 401", async () => {
    const response = await request(createTestApp())
      .get("/api/v1/auth/me")
      .set("Authorization", "InvalidFormat token");

    assert.equal(response.status, 401);
    assert.equal(response.body.success, false);
    assert.equal(response.body.code, "MISSING_AUTH_HEADER");
  });
});
