import { z } from "zod";

const createCustomerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Customer name must be at least 2 characters"),
    phone: z.string().min(6, "Phone number must be at least 6 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    address: z.string().optional(),
  }),
});

const updateCustomerValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Customer name must be at least 2 characters")
      .optional(),
    phone: z
      .string()
      .min(6, "Phone number must be at least 6 characters")
      .optional(),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    address: z.string().optional(),
  }),
});

export const CustomerValidation = {
  createCustomerValidationSchema,
  updateCustomerValidationSchema,
};
