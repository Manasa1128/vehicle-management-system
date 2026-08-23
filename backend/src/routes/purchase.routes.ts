import { Router } from "express";

import {
  createPurchase,
  getUserPurchases,
  getPurchaseById,
} from "../controllers/purchase.controller";

import { authMiddleware } from "../middleware/auth.middleware";

import { validate } from "../middleware/validation.middleware";

import {
  createPurchaseSchema,
} from "../validators/purchase.validator";

const router = Router();

// ==================== PURCHASE ROUTES ====================

// Create purchase
router.post(
  "/",
  authMiddleware,
  validate(createPurchaseSchema),
  createPurchase
);

// Get logged-in user's purchases
router.get(
  "/",
  authMiddleware,
  getUserPurchases
);

// Get purchase by ID
router.get(
  "/:id",
  authMiddleware,
  getPurchaseById
);

export default router;