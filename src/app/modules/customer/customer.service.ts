import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError";
import QueryBuilder from "../../utils/QueryBuilder";
import { Customer } from "./customer.model";
import { ICustomer } from "./customer.interface";

const createCustomer = async (payload: Partial<ICustomer>) => {
  const existing = await Customer.findOne({ phone: payload.phone });
  if (existing) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "A customer with this phone number already exists",
    );
  }
  return Customer.create(payload);
};

const getAllCustomers = async (query: Record<string, unknown>) => {
  const customerQuery = new QueryBuilder(
    Customer.find({ isDeleted: false }),
    query,
  )
    .search(["name", "phone", "email"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await customerQuery.modelQuery;
  const meta = await customerQuery.countTotal();

  return { data, meta };
};

const getSingleCustomer = async (id: string) => {
  const customer = await Customer.findOne({ _id: id, isDeleted: false });
  if (!customer) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Customer not found");
  }
  return customer;
};

const updateCustomer = async (id: string, payload: Partial<ICustomer>) => {
  const customer = await Customer.findOne({ _id: id, isDeleted: false });
  if (!customer) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Customer not found");
  }

  if (payload.phone && payload.phone !== customer.phone) {
    const existing = await Customer.findOne({ phone: payload.phone });
    if (existing) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "A customer with this phone number already exists",
      );
    }
  }

  return Customer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteCustomer = async (id: string) => {
  const customer = await Customer.findOne({ _id: id, isDeleted: false });
  if (!customer) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Customer not found");
  }
  customer.isDeleted = true;
  await customer.save();
  return null;
};

export const CustomerService = {
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
};
