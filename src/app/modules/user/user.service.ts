import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError";
import { User } from "./user.model";
import { IUser } from "./user.interface";

const createUser = async (payload: IUser) => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "A user with this email already exists",
    );
  }
  const user = await User.create(payload);
  return user;
};

const getAllUsers = async () => {
  return User.find();
};

export const UserService = {
  createUser,
  getAllUsers,
};
