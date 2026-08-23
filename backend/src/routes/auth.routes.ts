import express from "express";

import {
  register,
  login,
} from "../controllers/auth.controller";

import { validate } from "../middleware/validation.middleware";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator";

const router = express.Router();

// ==================== REGISTER ====================

router.post(
  "/register",
  validate(registerSchema),
  register
);

// ==================== LOGIN ====================

router.post(
  "/login",
  validate(loginSchema),
  login
);

export default router;