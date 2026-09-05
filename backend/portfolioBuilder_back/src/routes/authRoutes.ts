import { Router } from "express";

import { register } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/auth/register", register);
