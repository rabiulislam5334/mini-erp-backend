import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DashboardService } from "./dashboard.service";

const getDashboardStats = catchAsync(async (_req, res) => {
  const result = await DashboardService.getDashboardStats();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard statistics fetched successfully",
    data: result,
  });
});

export const DashboardController = {
  getDashboardStats,
};
