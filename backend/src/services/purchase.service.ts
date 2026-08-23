import prisma from "../utils/prisma";

import {
  getUserPurchases,
  getPurchaseById,
} from "../repositories/purchase.repository";

// ==================== CREATE PURCHASE ====================

export const createPurchaseService = async (
  userId: number,
  vehicleId: number,
  quantity: number
) => {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const purchase = await prisma.$transaction(async (tx) => {
    // Find vehicle
    const vehicle = await tx.vehicle.findUnique({
      where: {
        id: vehicleId,
      },
    });

    // Vehicle does not exist
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // Check available quantity
    if (vehicle.quantity < quantity) {
      throw new Error("Insufficient vehicle quantity");
    }

    // Calculate total price
    const totalPrice = vehicle.price * quantity;

    // Reduce vehicle quantity
    await tx.vehicle.update({
      where: {
        id: vehicleId,
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    // Create purchase
    return await tx.purchase.create({
      data: {
        userId,
        vehicleId,
        quantity,
        totalPrice,
      },
      include: {
        vehicle: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  });

  return purchase;
};

// ==================== GET USER PURCHASES ====================

export const getUserPurchasesService = async (
  userId: number
) => {
  return await getUserPurchases(userId);
};

// ==================== GET PURCHASE BY ID ====================

export const getPurchaseByIdService = async (
  id: number,
  userId: number
) => {
  return await getPurchaseById(id, userId);
};