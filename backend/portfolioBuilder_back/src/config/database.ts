import pg from "pg";

import { env } from "./env.js";

const { Pool } = pg;

export const pool = env.databaseUrl
  ? new Pool({
      connectionString: env.databaseUrl,
    })
  : null;

export type DatabaseStatus = "connected" | "not_configured" | "error";

export const checkDatabaseConnection = async (): Promise<DatabaseStatus> => {
  if (!pool) {
    return "not_configured";
  }

  try {
    await pool.query("SELECT 1");
    return "connected";
  } catch {
    return "error";
  }
};

export const closeDatabasePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
  }
};
