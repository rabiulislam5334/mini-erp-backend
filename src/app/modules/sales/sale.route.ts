import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../../constants/roles";
import { SaleController } from "./sale.controller";
import { SaleValidation } from "./sale.validation";

const router = Router();

// Admin, Manager, Employee — all can create sales
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.EMPLOYEE),
  validateRequest(SaleValidation.createSaleValidationSchema),
  SaleController.createSale,
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.EMPLOYEE),
  SaleController.getAllSales,
);

router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.EMPLOYEE),
  SaleController.getSingleSale,
);

export const SaleRoutes = router;
