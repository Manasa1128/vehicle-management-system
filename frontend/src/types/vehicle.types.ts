export interface Vehicle {
  id: number;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclePagination {
  page: number;
  limit: number;
  totalResults: number;
  totalPages: number;
}

export interface VehicleResponse {
  message: string;
  vehicles: Vehicle[];
  pagination: VehiclePagination;
}

export interface CreateVehicleData {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export interface UpdateVehicleData {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}