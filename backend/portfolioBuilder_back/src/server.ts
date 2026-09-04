import { app } from "./app.js";
import { env } from "./config/env.js";
import { closeDatabasePool } from "./config/database.js";

const server = app.listen(env.port, () => {
  console.log(`Portfolio Builder API listening on port ${env.port}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received. Closing server.`);

  server.close(() => {
    void closeDatabasePool().finally(() => {
      process.exit(0);
    });
  });
};

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});
