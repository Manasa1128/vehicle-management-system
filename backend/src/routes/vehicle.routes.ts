import express from "express";

import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from "../controllers/vehicle.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import { validate } from "../middleware/validation.middleware";

import {
  createVehicleSchema,
  updateVehicleSchema,
} from "../validators/vehicle.validator";

const router = express.Router();

// ==================== CREATE VEHICLE ====================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validate(createVehicleSchema),
  createVehicle
);

// ==================== GET ALL VEHICLES ====================

router.get(
  "/",
  authMiddleware,
  getAllVehicles
);

// ==================== SEARCH VEHICLES ====================

router.get(
  "/search",
  authMiddleware,
  getAllVehicles
);

// ==================== PURCHASE VEHICLE ====================

router.post(
  "/:id/purchase",
  authMiddleware,
  purchaseVehicle
);

// ==================== RESTOCK VEHICLE ====================

router.post(
  "/:id/restock",
  authMiddleware,
  adminMiddleware,
  restockVehicle
);

// ==================== GET VEHICLE BY ID ====================

router.get(
  "/:id",
  authMiddleware,
  getVehicleById
);

// ==================== UPDATE VEHICLE ====================

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(updateVehicleSchema),
  updateVehicle
);

// ==================== DELETE VEHICLE ====================

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteVehicle
);

export default router;
