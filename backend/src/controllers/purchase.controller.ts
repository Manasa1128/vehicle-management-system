import { Request, Response } from "express";

import {
  createPurchaseService,
  getUserPurchasesService,
  getPurchaseByIdService,
} from "../services/purchase.service";

// ==================== CREATE PURCHASE ====================

export const createPurchase = async (
  req: Request,
  res: Response
) => {
  try {
    const { vehicleId, quantity } = req.body;

    const user = (req as any).user;

    if (!user || !user.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userId = Number(user.userId);

    // Validate required fields
    if (vehicleId === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "Vehicle ID and quantity are required",
      });
    }

    const vehicleIdNumber = Number(vehicleId);
    const quantityNumber = Number(quantity);

    // Validate vehicle ID
    if (isNaN(vehicleIdNumber)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    // Validate quantity
    if (
      isNaN(quantityNumber) ||
      quantityNumber <= 0 ||
      !Number.isInteger(quantityNumber)
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const purchase = await createPurchaseService(
      userId,
      vehicleIdNumber,
      quantityNumber
    );

    return res.status(201).json({
      message: "Purchase successful",
      purchase,
    });
  } catch (error: any) {
    // Expected business errors don't need console.error
    if (error.message === "Vehicle not found") {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    if (error.message === "Insufficient vehicle quantity") {
      return res.status(400).json({
        message: "Insufficient vehicle quantity",
      });
    }

    if (error.message === "Quantity must be greater than 0") {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    // Log only unexpected server errors
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==================== GET USER PURCHASES ====================

export const getUserPurchases = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    if (!user || !user.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userId = Number(user.userId);

    const purchases = await getUserPurchasesService(
      userId
    );

    return res.status(200).json({
      message: "Purchases fetched successfully",
      purchases,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==================== GET PURCHASE BY ID ====================

export const getPurchaseById = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    if (!user || !user.userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userId = Number(user.userId);
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid purchase ID",
      });
    }

    const purchase = await getPurchaseByIdService(
      id,
      userId
    );

    if (!purchase) {
      return res.status(404).json({
        message: "Purchase not found",
      });
    }

    return res.status(200).json({
      message: "Purchase fetched successfully",
      purchase,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};