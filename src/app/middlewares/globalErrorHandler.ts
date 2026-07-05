import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import { env } from "../config/env";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails: unknown = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails = err.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails = Object.values(err.errors).map((e) => e.message);
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  } else if (err.code === 11000) {
    // Mongo duplicate key error
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field: ${field}`;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
    stack: env.NODE_ENV === "development" ? err?.stack : undefined,
  });
};

export default globalErrorHandler;
