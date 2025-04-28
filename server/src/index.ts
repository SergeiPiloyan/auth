import dotenv from "dotenv";
import { App } from "./app";
import apiRouter from "./router";

dotenv.config();

process.env.TZ = "Etc/UTC";

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled promise rejection", { reason, promise });
});

process.on("uncaughtException", (error) => {
  console.log("Uncaught exception", { error });
});

const start = () => {
  const app = App.init();

  app.use("/api", apiRouter);
};

try {
  start();
} catch (e) {
  console.error(e);
  process.exit(-1);
}
