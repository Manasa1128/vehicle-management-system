import { Request, Response } from "express";
import {
  getAllUsersService,
  getAllVehiclesService,
  getAllPurchasesService,
  getAdminStatsService,
} from "../services/admin.service";

// ==================== GET ALL USERS ====================

export const getAllUsers = async (
  req: Request,
  res: Response
) => {
  try {
    const users = await getAllUsersService();

    return res.status(200).json({
      message: "Users fetched successfully",
      users,
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
    const vehicles = await getAllVehiclesService();

    return res.status(200).json({
      message: "Vehicles fetched successfully",
      vehicles,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ==================== GET ALL PURCHASES ====================

export const getAllPurchases = async (
  req: Request,
  res: Response
) => {
  try {
    const purchases = await getAllPurchasesService();

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

// ==================== GET ADMIN STATS ====================

export const getAdminStats = async (
  req: Request,
  res: Response
) => {
  try {
    const stats = await getAdminStatsService();

    return res.status(200).json({
      message: "Admin statistics fetched successfully",
      stats,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};