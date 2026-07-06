import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

export const AuthController = {
  login,
};
