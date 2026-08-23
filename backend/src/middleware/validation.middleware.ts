import {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodSchema } from "zod";

// ==================== VALIDATION MIDDLEWARE ====================

export const validate = (schema: ZodSchema) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Validate request body
    const result = schema.safeParse(req.body);

    // ==================== VALIDATION FAILED ====================

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",

        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // ==================== VALIDATION SUCCESS ====================

    req.body = result.data;

    next();
  };
};