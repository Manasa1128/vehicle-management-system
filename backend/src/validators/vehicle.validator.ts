import { z } from "zod";

// ==================== CREATE VEHICLE ====================

export const createVehicleSchema = z.object({
  make: z
    .string()
    .trim()
    .min(2, "Make is required")
    .max(50, "Make cannot exceed 50 characters"),

  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .max(50, "Model cannot exceed 50 characters"),

  category: z
    .string()
    .trim()
    .min(2, "Category is required")
    .max(50, "Category cannot exceed 50 characters"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative"),
});

// ==================== UPDATE VEHICLE ====================

export const updateVehicleSchema =
  createVehicleSchema.partial();