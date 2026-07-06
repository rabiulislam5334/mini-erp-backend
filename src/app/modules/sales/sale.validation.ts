import { z } from "zod";

const createSaleValidationSchema = z.object({
  body: z.object({
    customer: z.string().min(1, "Customer ID is required"),
    items: z
      .array(
        z.object({
          product: z.string().min(1, "Product ID is required"),
          quantity: z.coerce
            .number()
            .int("Quantity must be an integer")
            .positive("Quantity must be at least 1"),
        }),
      )
      .min(1, "At least one product is required in a sale"),
  }),
});

export const SaleValidation = {
  createSaleValidationSchema,
};
