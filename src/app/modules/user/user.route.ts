import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../../constants/roles";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router();

// Only Admin can create Manager/Employee accounts and view all users
router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserController.createUser,
);

router.get("/", auth(USER_ROLE.ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
