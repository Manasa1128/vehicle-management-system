import api from "./api";

import type {
  VehicleResponse,
  CreateVehicleData,
  UpdateVehicleData,
  Vehicle,
} from "../types/vehicle.types";

// ==================== GET VEHICLES ====================

export interface VehicleQueryParams {
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

export const getVehicles = async (
  params?: VehicleQueryParams
): Promise<VehicleResponse> => {
  const response = await api.get<VehicleResponse>(
    "/vehicles",
    {
      params,
    }
  );

  return response.data;
};

// ==================== GET VEHICLE BY ID ====================

export const getVehicleById = async (
  id: number
): Promise<Vehicle> => {
  const response = await api.get<{
    message: string;
    vehicle: Vehicle;
  }>(`/vehicles/${id}`);

  return response.data.vehicle;
};

// ==================== CREATE VEHICLE ====================

export const createVehicle = async (
  data: CreateVehicleData
): Promise<Vehicle> => {
  const response = await api.post<{
    message: string;
    vehicle: Vehicle;
  }>("/vehicles", data);

  return response.data.vehicle;
};

// ==================== UPDATE VEHICLE ====================

export const updateVehicle = async (
  id: number,
  data: UpdateVehicleData
): Promise<Vehicle> => {
  const response = await api.put<{
    message: string;
    vehicle: Vehicle;
  }>(`/vehicles/${id}`, data);

  return response.data.vehicle;
};

// ==================== DELETE VEHICLE ====================

export const deleteVehicle = async (
  id: number
): Promise<void> => {
  await api.delete(`/vehicles/${id}`);
};

// ==================== RESTOCK VEHICLE ====================

export const restockVehicle = async (
  id: number,
  quantity: number
): Promise<Vehicle> => {
  const response = await api.post<{
    message: string;
    vehicle: Vehicle;
  }>(`/vehicles/${id}/restock`, {
    quantity,
  });

  return response.data.vehicle;
};
