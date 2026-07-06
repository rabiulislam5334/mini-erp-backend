import { z } from "zod";

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    sku: z.string().min(2, "SKU must be at least 2 characters"),
    category: z.string().min(2, "Category must be at least 2 characters"),
    purchasePrice: z.coerce
      .number()
      .min(0, "Purchase price must be 0 or greater"),
    sellingPrice: z.coerce
      .number()
      .min(0, "Selling price must be 0 or greater"),
    stockQuantity: z.coerce
      .number()
      .min(0, "Stock quantity must be 0 or greater"),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Product name must be at least 2 characters")
      .optional(),
    sku: z.string().min(2, "SKU must be at least 2 characters").optional(),
    category: z
      .string()
      .min(2, "Category must be at least 2 characters")
      .optional(),
    purchasePrice: z.coerce
      .number()
      .min(0, "Purchase price must be 0 or greater")
      .optional(),
    sellingPrice: z.coerce
      .number()
      .min(0, "Selling price must be 0 or greater")
      .optional(),
    stockQuantity: z.coerce
      .number()
      .min(0, "Stock quantity must be 0 or greater")
      .optional(),
  }),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
