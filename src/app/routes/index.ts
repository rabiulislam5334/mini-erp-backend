import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { ProductRoutes } from "../modules/product/product.route";
import { CustomerRoutes } from "../modules/customer/customer.route";
import { SaleRoutes } from "../modules/sales/sale.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.route";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/products", route: ProductRoutes },
  { path: "/customers", route: CustomerRoutes },
  { path: "/sales", route: SaleRoutes },
  { path: "/dashboard", route: DashboardRoutes },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
