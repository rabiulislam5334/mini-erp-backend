import express, { Application, Request, Response } from "express";
import cors from "cors";
import { env } from "./app/config/env";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app: Application = express();

// ---------- Global Middlewares ----------
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Health Check ----------
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Mini ERP API is running 🚀",
  });
});

// ---------- API Routes ----------
app.use("/api/v1", router);

// ---------- 404 + Global Error Handler ----------
app.use(notFound);
app.use(globalErrorHandler);

export default app;
