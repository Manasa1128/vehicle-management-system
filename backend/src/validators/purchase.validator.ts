import { z } from "zod";

// ==================== CREATE PURCHASE ====================

export const createPurchaseSchema = z.object({
  vehicleId: z
    .number()
    .int("Vehicle ID must be an integer")
    .positive("Vehicle ID must be greater than 0"),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than 0"),
});