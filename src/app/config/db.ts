import mongoose from "mongoose";
import { env } from "./env";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.DATABASE_URL);
  }
  await connectionPromise;
};
