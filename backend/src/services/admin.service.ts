import prisma from "../utils/prisma";

// ==================== GET ALL USERS ====================

export const getAllUsersService = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ==================== GET ALL VEHICLES ====================

export const getAllVehiclesService = async () => {
  return await prisma.vehicle.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ==================== GET ALL PURCHASES ====================

export const getAllPurchasesService = async () => {
  return await prisma.purchase.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      vehicle: {
        select: {
          id: true,
          make: true,
          model: true,
          category: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ==================== GET ADMIN STATISTICS ====================

export const getAdminStatsService = async () => {
  const totalUsers = await prisma.user.count();

  const totalVehicles = await prisma.vehicle.count();

  const totalPurchases = await prisma.purchase.count();

  const vehicleStock = await prisma.vehicle.aggregate({
    _sum: {
      quantity: true,
    },
  });

  const purchaseRevenue = await prisma.purchase.aggregate({
    _sum: {
      totalPrice: true,
    },
  });

  return {
    totalUsers,
    totalVehicles,
    totalPurchases,
    totalVehicleStock: vehicleStock._sum.quantity || 0,
    totalRevenue: purchaseRevenue._sum.totalPrice || 0,
  };
};