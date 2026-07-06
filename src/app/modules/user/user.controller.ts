import { StatusCodes } from "http-status-codes"; 
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED, 
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (_req, res) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    statusCode: StatusCodes.OK, 
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
};
