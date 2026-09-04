import { checkDatabaseConnection } from "../config/database.js";

export const getHealthStatus = async () => {
  const database = await checkDatabaseConnection();

  return {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database,
  };
};
