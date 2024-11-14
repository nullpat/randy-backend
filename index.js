import { client } from "./src/musicbot.js";
import express from "express";
import router from "./src/v1/routes/routes.js";

client.login(process.env.DISCORD_TOKEN);

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})

app.use(express.json());
app.use("/api/v1", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send(
    "Internal Server Error" //  can do ||  err.message if not running as release mode
  );
});
