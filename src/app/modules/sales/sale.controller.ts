import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SaleService } from "./sale.service";

const createSale = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await SaleService.createSale(req.body, user?.userId);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Sale created successfully",
    data: result,
  });
});

const getAllSales = catchAsync(async (req, res) => {
  const { data, meta } = await SaleService.getAllSales(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Sales fetched successfully",
    meta,
    data,
  });
});

const getSingleSale = catchAsync(async (req, res) => {
  const result = await SaleService.getSingleSale(req.params.id as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Sale fetched successfully",
    data: result,
  });
});

export const SaleController = {
  createSale,
  getAllSales,
  getSingleSale,
};
