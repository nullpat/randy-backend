import errsole  from "errsole";
import ErrsoleSQLite from "errsole-sqlite";
import express from "express";
import router from "./src/routes/routes.js";
import { client } from "./src/musicbot.js";

errsole.initialize({
  storage: new ErrsoleSQLite('./logs.sqlite'),
  enableConsoleOutput: true
});

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})

app.use(express.json());
app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send(
    "Internal Server Error" //  can do ||  err.message if not running as release mode
  );
});

client.login(process.env.DISCORD_TOKEN);
