import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError";
import QueryBuilder from "../../utils/QueryBuilder";
import { Sale } from "./sale.model";
import { Product } from "../product/product.model";
import { Customer } from "../customer/customer.model";
import { ICreateSalePayload, ISaleItem } from "./sale.interface";

const createSale = async (payload: ICreateSalePayload, createdBy: string) => {
  const customer = await Customer.findOne({
    _id: payload.customer,
    isDeleted: false,
  });
  if (!customer) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Customer not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const saleItems: ISaleItem[] = [];
    let grandTotal = 0;

    for (const item of payload.items) {
      const product = await Product.findOne({
        _id: item.product,
        isDeleted: false,
      }).session(session);

      if (!product) {
        throw new ApiError(
          StatusCodes.NOT_FOUND,
          `Product not found: ${item.product}`,
        );
      }

      if (product.stockQuantity < item.quantity) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
        );
      }

      const subtotal = product.sellingPrice * item.quantity;
      grandTotal += subtotal;

      saleItems.push({
        product: product._id as any,
        quantity: item.quantity,
        unitPrice: product.sellingPrice,
        subtotal,
      });

      // Atomically decrement stock — also re-checked here with a query
      // condition so two simultaneous requests can never oversell.
      const updateResult = await Product.updateOne(
        { _id: product._id, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
        { session },
      );

      if (updateResult.modifiedCount === 0) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for "${product.name}". Please refresh and try again.`,
        );
      }
    }

    const [sale] = await Sale.create(
      [
        {
          customer: customer._id,
          items: saleItems,
          grandTotal,
          createdBy,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    const populatedSale = await Sale.findById(sale._id)
      .populate("customer", "name phone email")
      .populate("items.product", "name sku");

    return populatedSale;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllSales = async (query: Record<string, unknown>) => {
  const saleQuery = new QueryBuilder(
    Sale.find()
      .populate("customer", "name phone")
      .populate("items.product", "name sku"),
    query,
  )
    .filter()
    .sort()
    .paginate();

  const data = await saleQuery.modelQuery;
  const meta = await saleQuery.countTotal();

  return { data, meta };
};

const getSingleSale = async (id: string) => {
  const sale = await Sale.findById(id)
    .populate("customer", "name phone email address")
    .populate("items.product", "name sku category");

  if (!sale) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Sale not found");
  }
  return sale;
};

export const SaleService = {
  createSale,
  getAllSales,
  getSingleSale,
};
