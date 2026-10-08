import { Router } from "express";

import { authRouter } from "./authRoutes.js";
import { healthRouter } from "./healthRoutes.js";
import { portfolioRouter } from "./portfolioRoutes.js";
import { projectRouter } from "./projectRoutes.js";
import { skillRouter } from "./skillRoutes.js";
import { experienceRouter } from "./experienceRoutes.js";
import { educationRouter } from "./educationRoutes.js";

export const apiRouter = Router();

apiRouter.use(authRouter);
apiRouter.use(healthRouter);
apiRouter.use(portfolioRouter);
apiRouter.use(projectRouter);
apiRouter.use(skillRouter);
apiRouter.use(experienceRouter);
apiRouter.use(educationRouter);
