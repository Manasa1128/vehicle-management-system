import type { Vehicle } from "./vehicle.types";

export interface Purchase {
  id: number;
  userId: number;
  vehicleId: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  vehicle?: Vehicle;
}

export interface CreatePurchaseData {
  vehicleId: number;
  quantity: number;
}