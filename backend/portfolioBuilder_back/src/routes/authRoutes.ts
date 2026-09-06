import { Router } from "express";

import { authenticate } from "../middleware/auth.js";
import { getCurrentUser, login, register } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);
authRouter.get("/auth/me", authenticate, getCurrentUser);
