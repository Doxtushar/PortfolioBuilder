import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined): number => {
  const parsed = Number(value ?? "5000");

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return parsed;
};

export const env = {
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL?.trim() || undefined,
  corsOrigin: process.env.CORS_ORIGIN?.trim() || undefined,
  nodeEnv: process.env.NODE_ENV?.trim() || "development",
  jwtSecret: process.env.JWT_SECRET?.trim() || undefined,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN?.trim() || "7d") as string,
};

export const isProduction = env.nodeEnv === "production";
