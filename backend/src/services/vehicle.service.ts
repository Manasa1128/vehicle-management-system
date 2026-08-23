import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  VehicleFilters,
} from "../repositories/vehicle.repository";

// ==================== CREATE VEHICLE ====================

export const createVehicleService = async (
  make: string,
  model: string,
  category: string,
  price: number,
  quantity: number
) => {
  return await createVehicle(
    make,
    model,
    category,
    price,
    quantity
  );
};

// ==================== GET ALL VEHICLES ====================

export const getAllVehiclesService = async (
  filters: VehicleFilters = {}
) => {
  return await getAllVehicles(filters);
};

// ==================== GET VEHICLE BY ID ====================

export const getVehicleByIdService = async (
  id: number
) => {
  return await getVehicleById(id);
};

// ==================== UPDATE VEHICLE ====================

export const updateVehicleService = async (
  id: number,
  make: string,
  model: string,
  category: string,
  price: number,
  quantity: number
) => {
  return await updateVehicle(
    id,
    make,
    model,
    category,
    price,
    quantity
  );
};

// ==================== DELETE VEHICLE ====================

export const deleteVehicleService = async (
  id: number
) => {
  return await deleteVehicle(id);
};

// ==================== RESTOCK VEHICLE ====================

export const restockVehicleService = async (
  id: number,
  quantity: number
) => {
  const vehicle = await getVehicleById(id);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer");
  }

  return await updateVehicle(
    id,
    vehicle.make,
    vehicle.model,
    vehicle.category,
    vehicle.price,
    vehicle.quantity + quantity
  );
};
