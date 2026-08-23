import prisma from "../utils/prisma";
import { Prisma } from "@prisma/client";

// ==================== CREATE VEHICLE ====================

export const createVehicle = async (
  make: string,
  model: string,
  category: string,
  price: number,
  quantity: number
) => {
  return await prisma.vehicle.create({
    data: {
      make,
      model,
      category,
      price,
      quantity,
    },
  });
};

// ==================== GET ALL VEHICLES ====================

export interface VehicleFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: "price" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const getAllVehicles = async (
  filters: VehicleFilters = {}
) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    inStock,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = filters;

  const where: Prisma.VehicleWhereInput = {};

  // ==================== SEARCH ====================

  if (search) {
    where.OR = [
      {
        make: {
          contains: search,
        },
      },
      {
        model: {
          contains: search,
        },
      },
      {
        category: {
          contains: search,
        },
      },
    ];
  }

  // ==================== CATEGORY FILTER ====================

  if (category) {
    where.category = {
      equals: category,
    };
  }

  // ==================== PRICE FILTER ====================

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  // ==================== STOCK FILTER ====================

  if (inStock === true) {
    where.quantity = {
      gt: 0,
    };
  }

  if (inStock === false) {
    where.quantity = {
      equals: 0,
    };
  }

  // ==================== SORTING ====================

  let orderBy: Prisma.VehicleOrderByWithRelationInput;

  if (sortBy === "price") {
    orderBy = {
      price: sortOrder,
    };
  } else if (sortBy === "name") {
    orderBy = {
      make: sortOrder,
    };
  } else {
    orderBy = {
      createdAt: sortOrder,
    };
  }

  // ==================== PAGINATION ====================

  const skip = (page - 1) * limit;

  const [vehicles, totalResults] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),

    prisma.vehicle.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalResults / limit);

  return {
    vehicles,
    pagination: {
      page,
      limit,
      totalResults,
      totalPages,
    },
  };
};

// ==================== GET VEHICLE BY ID ====================

export const getVehicleById = async (id: number) => {
  return await prisma.vehicle.findUnique({
    where: {
      id,
    },
  });
};

// ==================== UPDATE VEHICLE ====================

export const updateVehicle = async (
  id: number,
  make: string,
  model: string,
  category: string,
  price: number,
  quantity: number
) => {
  return await prisma.vehicle.update({
    where: {
      id,
    },
    data: {
      make,
      model,
      category,
      price,
      quantity,
    },
  });
};

// ==================== DELETE VEHICLE ====================

export const deleteVehicle = async (id: number) => {
  return await prisma.vehicle.delete({
    where: {
      id,
    },
  });
};