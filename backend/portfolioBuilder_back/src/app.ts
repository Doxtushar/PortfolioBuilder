import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
  }),
);
app.use(express.json());

app.use("/api/v1", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
