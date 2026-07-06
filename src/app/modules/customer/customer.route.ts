import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../../constants/roles";
import { CustomerController } from "./customer.controller";
import { CustomerValidation } from "./customer.validation";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  validateRequest(CustomerValidation.createCustomerValidationSchema),
  CustomerController.createCustomer,
);

// Employee also needs to view customers to select one while creating a sale
router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.EMPLOYEE),
  CustomerController.getAllCustomers,
);

router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.EMPLOYEE),
  CustomerController.getSingleCustomer,
);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  validateRequest(CustomerValidation.updateCustomerValidationSchema),
  CustomerController.updateCustomer,
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  CustomerController.deleteCustomer,
);

export const CustomerRoutes = router;
