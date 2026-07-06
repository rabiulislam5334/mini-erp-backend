import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError";
import QueryBuilder from "../../utils/QueryBuilder";
import { uploadBufferToCloudinary } from "../../utils/uploadToCloudinary";
import { Product } from "./product.model";
import { IProduct } from "./product.interface";

const createProduct = async (
  payload: Partial<IProduct>,
  file?: Express.Multer.File,
) => {
  if (!file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Product image is required");
  }

  const existingSku = await Product.findOne({ sku: payload.sku });
  if (existingSku) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "A product with this SKU already exists",
    );
  }

  const imageUrl = await uploadBufferToCloudinary(file.buffer);

  const product = await Product.create({
    ...payload,
    image: imageUrl,
  });

  return product;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find({ isDeleted: false }),
    query,
  )
    .search(["name", "sku", "category"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return { data, meta };
};

const getSingleProduct = async (id: string) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }
  return product;
};

const updateProduct = async (
  id: string,
  payload: Partial<IProduct>,
  file?: Express.Multer.File,
) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }

  if (payload.sku && payload.sku !== product.sku) {
    const existingSku = await Product.findOne({ sku: payload.sku });
    if (existingSku) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "A product with this SKU already exists",
      );
    }
  }

  let imageUrl = product.image;
  if (file) {
    imageUrl = await uploadBufferToCloudinary(file.buffer);
  }

  const updated = await Product.findByIdAndUpdate(
    id,
    { ...payload, image: imageUrl },
    { new: true, runValidators: true },
  );

  return updated;
};

const deleteProduct = async (id: string) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }

  // Soft delete — keeps sale history intact for past sales referencing this product
  product.isDeleted = true;
  await product.save();

  return null;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
