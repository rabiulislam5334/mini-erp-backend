import mongoose from "mongoose";
import app from "../src/app";
import { env } from "../src/app/config/env";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConnPromise: Promise<typeof mongoose> | undefined;
}

const connectDB = (): Promise<typeof mongoose> => {
  if (!global.__mongooseConnPromise) {
    global.__mongooseConnPromise = mongoose
      .connect(env.DATABASE_URL)
      .then((conn) => {
        console.log("✅ MongoDB connected successfully");
        return conn;
      })
      .catch((err) => {
        global.__mongooseConnPromise = undefined;
        throw err;
      });
  }
  return global.__mongooseConnPromise;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  try {
    await connectDB();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Database connection failed",
    });
    return;
  }

  return app(req, res);
}
