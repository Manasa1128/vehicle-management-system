import { Request, Response } from "express";

import {
  createVehicleService,
  getAllVehiclesService,
  getVehicleByIdService,
  updateVehicleService,
  deleteVehicleService,
  restockVehicleService,
} from "../services/vehicle.service";
import { createPurchaseService } from "../services/purchase.service";

// ==================== CREATE VEHICLE ====================

export const createVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      make,
      model,
      category,
      price,
      quantity,
    } = req.body;

    if (
      !make ||
      !model ||
      !category ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        message:
          "Make, model, category, price and quantity are required",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        message: "Quantity cannot be negative",
      });
    }

    const vehicle = await createVehicleService(
      make,
      model,
      category,
      Number(price),
      Number(quantity)
    );

    return res.status(201).json({
      message: "Vehicle created successfully",
      vehicle,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==================== GET ALL VEHICLES ====================

export const getAllVehicles = async (
  req: Request,
  res: Response
) => {
  try {
    // ==================== QUERY PARAMETERS ====================

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : undefined;

    const category =
      typeof req.query.category === "string"
        ? req.query.category.trim()
        : undefined;

    const minPrice =
      req.query.minPrice !== undefined
        ? Number(req.query.minPrice)
        : undefined;

    const maxPrice =
      req.query.maxPrice !== undefined
        ? Number(req.query.maxPrice)
        : undefined;

    const page =
      req.query.page !== undefined
        ? Number(req.query.page)
        : 1;

    const limit =
      req.query.limit !== undefined
        ? Number(req.query.limit)
        : 10;

    const sortBy =
      typeof req.query.sortBy === "string"
        ? req.query.sortBy
        : "createdAt";

    const sortOrder =
      req.query.sortOrder === "asc"
        ? "asc"
        : "desc";

    // ==================== VALIDATE NUMBERS ====================

    if (
      minPrice !== undefined &&
      (isNaN(minPrice) || minPrice < 0)
    ) {
      return res.status(400).json({
        message: "Invalid minimum price",
      });
    }

    if (
      maxPrice !== undefined &&
      (isNaN(maxPrice) || maxPrice < 0)
    ) {
      return res.status(400).json({
        message: "Invalid maximum price",
      });
    }

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return res.status(400).json({
        message:
          "Minimum price cannot be greater than maximum price",
      });
    }

    if (
      isNaN(page) ||
      page < 1 ||
      !Number.isInteger(page)
    ) {
      return res.status(400).json({
        message: "Page must be a positive integer",
      });
    }

    if (
      isNaN(limit) ||
      limit < 1 ||
      limit > 100 ||
      !Number.isInteger(limit)
    ) {
      return res.status(400).json({
        message:
          "Limit must be between 1 and 100",
      });
    }

    // ==================== VALIDATE SORT ====================

    const allowedSortFields = [
      "price",
      "name",
      "createdAt",
    ];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        message:
          "Invalid sortBy. Allowed values: price, name, createdAt",
      });
    }

    // ==================== IN STOCK ====================

    let inStock: boolean | undefined;

    if (req.query.inStock !== undefined) {
      if (req.query.inStock === "true") {
        inStock = true;
      } else if (req.query.inStock === "false") {
        inStock = false;
      } else {
        return res.status(400).json({
          message:
            "inStock must be true or false",
        });
      }
    }

    // ==================== GET VEHICLES ====================

    const result = await getAllVehiclesService({
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy: sortBy as
        | "price"
        | "name"
        | "createdAt",
      sortOrder,
      page,
      limit,
    });

    return res.status(200).json({
      message: "Vehicles fetched successfully",
      vehicles: result.vehicles,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==================== GET VEHICLE BY ID ====================

export const getVehicleById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    const vehicle =
      await getVehicleByIdService(id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      message: "Vehicle fetched successfully",
      vehicle,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==================== UPDATE VEHICLE ====================

export const updateVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    const {
      make,
      model,
      category,
      price,
      quantity,
    } = req.body;

    if (
      !make ||
      !model ||
      !category ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        message:
          "Make, model, category, price and quantity are required",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        message: "Quantity cannot be negative",
      });
    }

    const existingVehicle =
      await getVehicleByIdService(id);

    if (!existingVehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    const vehicle =
      await updateVehicleService(
        id,
        make,
        model,
        category,
        Number(price),
        Number(quantity)
      );

    return res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==================== DELETE VEHICLE ====================

export const deleteVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    const existingVehicle =
      await getVehicleByIdService(id);

    if (!existingVehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    await deleteVehicleService(id);

    return res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==================== PURCHASE VEHICLE ====================

export const purchaseVehicle = async (
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

    const vehicleId = Number(req.params.id);
    const quantity =
      req.body.quantity === undefined
        ? 1
        : Number(req.body.quantity);

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    if (
      isNaN(quantity) ||
      quantity <= 0 ||
      !Number.isInteger(quantity)
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const purchase = await createPurchaseService(
      Number(user.userId),
      vehicleId,
      quantity
    );

    return res.status(201).json({
      message: "Purchase successful",
      purchase,
    });
  } catch (error: any) {
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

    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==================== RESTOCK VEHICLE ====================

export const restockVehicle = async (
  req: Request,
  res: Response
) => {
  try {
    const vehicleId = Number(req.params.id);
    const quantity = Number(req.body.quantity);

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    if (
      isNaN(quantity) ||
      quantity <= 0 ||
      !Number.isInteger(quantity)
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const vehicle = await restockVehicleService(
      vehicleId,
      quantity
    );

    return res.status(200).json({
      message: "Vehicle restocked successfully",
      vehicle,
    });
  } catch (error: any) {
    if (error.message === "Vehicle not found") {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
