import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import { env } from "../config/env";
import { TUserRole } from "../constants/roles";
import { IJwtPayload } from "../types/express";

const auth = (...allowedRoles: TUserRole[]) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "You are not authorized. Please login.",
        );
      }

      const token = authHeader.split(" ")[1];

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
      } catch {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Invalid or expired token. Please login again.",
        );
      }

      const payload = decoded as unknown as IJwtPayload;

      if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "You do not have permission to perform this action.",
        );
      }

      req.user = payload;
      next();
    },
  );
};

export default auth;
