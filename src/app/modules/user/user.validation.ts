import { z } from "zod";
import { USER_ROLES_ARRAY } from "../../constants/roles";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(USER_ROLES_ARRAY as [string, ...string[]]).optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
};
