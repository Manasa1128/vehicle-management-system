import api from "./api";

import type {
  Purchase,
  CreatePurchaseData,
} from "../types/purchase.types";

// ==================== CREATE PURCHASE ====================

export const createPurchase = async (
  data: CreatePurchaseData
): Promise<Purchase> => {
  const response = await api.post<{
    message: string;
    purchase: Purchase;
  }>("/purchases", data);

  return response.data.purchase;
};

// ==================== GET MY PURCHASES ====================

export const getMyPurchases = async (): Promise<
  Purchase[]
> => {
  const response = await api.get<{
    message: string;
    purchases: Purchase[];
  }>("/purchases");

  return response.data.purchases;
};

// ==================== GET PURCHASE BY ID ====================

export const getPurchaseById = async (
  id: number
): Promise<Purchase> => {
  const response = await api.get<{
    message: string;
    purchase: Purchase;
  }>(`/purchases/${id}`);

  return response.data.purchase;
};

export const purchaseVehicle = async (
  vehicleId: number,
  quantity = 1
): Promise<Purchase> => {
  const response = await api.post<{
    message: string;
    purchase: Purchase;
  }>(`/vehicles/${vehicleId}/purchase`, {
    quantity,
  });

  return response.data.purchase;
};
