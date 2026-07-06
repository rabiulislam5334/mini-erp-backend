import { Product } from "../product/product.model";
import { Customer } from "../customer/customer.model";
import { Sale } from "../sales/sale.model";

const LOW_STOCK_THRESHOLD = 5;

const getDashboardStats = async () => {
  const [
    totalProducts,
    totalCustomers,
    totalSales,
    lowStockProducts,
    salesAggregate,
  ] = await Promise.all([
    Product.countDocuments({ isDeleted: false }),
    Customer.countDocuments({ isDeleted: false }),
    Sale.countDocuments(),
    Product.find({
      isDeleted: false,
      stockQuantity: { $lt: LOW_STOCK_THRESHOLD },
    })
      .select("name sku stockQuantity category image")
      .sort({ stockQuantity: 1 }),
    Sale.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$grandTotal" } } },
    ]),
  ]);

  const totalRevenue = salesAggregate[0]?.totalRevenue || 0;

  return {
    totalProducts,
    totalCustomers,
    totalSales,
    totalRevenue,
    lowStockProducts,
  };
};

export const DashboardService = {
  getDashboardStats,
};
