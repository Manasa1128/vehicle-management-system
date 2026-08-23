import express from "express";

import {
  getAllUsers,
  getAllVehicles,
  getAllPurchases,
  getAdminStats,
} from "../controllers/admin.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = express.Router();

// ==================== ADMIN ROUTES ====================

// Get all users
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

// Get all vehicles
router.get(
  "/vehicles",
  authMiddleware,
  adminMiddleware,
  getAllVehicles
);

// Get all purchases
router.get(
  "/purchases",
  authMiddleware,
  adminMiddleware,
  getAllPurchases
);

// Get admin statistics
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getAdminStats
);

export default router;