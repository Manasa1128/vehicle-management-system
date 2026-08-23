import prisma from "../utils/prisma";

// ==================== CREATE PURCHASE ====================

export const createPurchase = async (
  userId: number,
  vehicleId: number,
  quantity: number,
  totalPrice: number
) => {
  return await prisma.purchase.create({
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
};

// ==================== GET USER PURCHASES ====================

export const getUserPurchases = async (userId: number) => {
  return await prisma.purchase.findMany({
    where: {
      userId,
    },
    include: {
      vehicle: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ==================== GET PURCHASE BY ID ====================

export const getPurchaseById = async (
  id: number,
  userId: number
) => {
  return await prisma.purchase.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      vehicle: true,
    },
  });
};