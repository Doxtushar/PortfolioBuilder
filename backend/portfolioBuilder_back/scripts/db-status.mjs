import "dotenv/config";
import pg from "pg";

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not configured.");
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({ connectionString: DATABASE_URL });

try {
  const result = await pool.query(
    `
      SELECT name, run_on
      FROM schema_migrations
      ORDER BY run_on ASC, id ASC
    `,
  );

  if (result.rowCount === 0) {
    console.log("No migrations have been applied.");
  } else {
    console.table(result.rows);
  }
} catch (error) {
  if (error instanceof Error && error.message.includes("schema_migrations")) {
    console.log("Migration history table does not exist yet.");
  } else {
    throw error;
  }
} finally {
  await pool.end();
}
