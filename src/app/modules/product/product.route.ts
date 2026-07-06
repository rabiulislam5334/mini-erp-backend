import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../middlewares/upload";
import { USER_ROLE } from "../../constants/roles";
import { ProductController } from "./product.controller";
import { ProductValidation } from "./product.validation";

const router = Router();

// Admin + Manager can create/update/delete products
// Admin + Manager + Employee can view products
router.post(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  upload.single("image"),
  validateRequest(ProductValidation.createProductValidationSchema),
  ProductController.createProduct,
);

router.get(
  "/",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.EMPLOYEE),
  ProductController.getAllProducts,
);

router.get(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER, USER_ROLE.EMPLOYEE),
  ProductController.getSingleProduct,
);

router.patch(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  upload.single("image"),
  validateRequest(ProductValidation.updateProductValidationSchema),
  ProductController.updateProduct,
);

router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.MANAGER),
  ProductController.deleteProduct,
);

export const ProductRoutes = router;
