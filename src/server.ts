import { Server } from "http";
import app from "./app";
import { connectDB } from "./app/config/db";
import { env } from "./app/config/env";

let server: Server;

async function main() {
  await connectDB();

  server = app.listen(env.PORT, () => {
    console.log(`🚀 Server is running on port ${env.PORT}`);
  });
}

main();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! Shutting down...", err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...", err);
  process.exit(1);
});
