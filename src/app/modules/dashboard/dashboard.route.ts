import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../constants/roles";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get(
  "/stats",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.EMPLOYEE),
  DashboardController.getDashboardStats,
);

export const DashboardRoutes = router;
