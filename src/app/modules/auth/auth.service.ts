import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError";
import { env } from "../../config/env";
import { IJwtPayload } from "../../types/express";
import { User } from "../user/user.model";

interface ILoginPayload {
  email: string;
  password: string;
}

const generateAccessToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
};

const loginUser = async (payload: ILoginPayload) => {
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "This account has been deactivated",
    );
  }

  const isPasswordMatched = await user.comparePassword(payload.password);
  if (!isPasswordMatched) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const jwtPayload: IJwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(jwtPayload);

  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const AuthService = {
  loginUser,
};
