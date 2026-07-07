import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import { connectDB } from "./app/config/db";

const app: Application = express();

// ---------- Global Middlewares & CORS ----------

const allowedOrigins = [
  "http://localhost:5173",
  "https://mini-erp-frontend-seven.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.indexOf(origin) !== -1 ||
        /^https:\/\/mini-erp-frontend-[a-z0-9]+-rabuil-islams-projects\.vercel\.app$/.test(
          origin,
        );

      if (isAllowed) return callback(null, true);

      return callback(
        new Error("CORS Policy Blocked by Mini-ERP Backend"),
        false,
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options("*", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// ---------- DB Connection (serverless-safe: reuses connection across warm invocations) ----------
app.use(async (_req: Request, _res: Response, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

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
