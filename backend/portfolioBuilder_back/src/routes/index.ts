import { Router } from "express";

import { authRouter } from "./authRoutes.js";
import { healthRouter } from "./healthRoutes.js";
import { portfolioRouter } from "./portfolioRoutes.js";
import { projectRouter } from "./projectRoutes.js";

export const apiRouter = Router();

apiRouter.use(authRouter);
apiRouter.use(healthRouter);
apiRouter.use(portfolioRouter);
apiRouter.use(projectRouter);
