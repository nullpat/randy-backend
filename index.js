import errsole from "errsole";
import ErrsoleSQLite from "errsole-sqlite";
import express from "express";
import router from "./src/routes/routes.js";
import { client } from "./src/musicbot.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import logger from "./src/utils/logger.js";

errsole.initialize({
  storage: new ErrsoleSQLite("./logs.sqlite"),
  port: process.env.ERRSOLE_PORT,
});

process.on("unhandledRejection", (error) => {
  logger.error(error.stack);
  errsole.alert(error);
});

process.on("uncaughtException", (error) => {
  logger.error(error.stack);
  errsole.alert(error);
});

process.on("warning", (error) => {
  logger.warn(error.stack);
});

client.login(process.env.DISCORD_TOKEN);

const app = express();
const port = process.env.API_PORT;

app.use(express.json());
app.use("/api", router);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`API is accessible at http://localhost:${port}`);
});
