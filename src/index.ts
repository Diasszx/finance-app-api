import "dotenv/config.js";
import express from "express";
import { PostgresHelper } from "./db/postgres/helper.js";

const app = express();

app.get("/api/users", async (req, res) => {
  const users = await PostgresHelper.query("SELECT * FROM users;");
  return res.json(users);
});

app.listen(process.env.PORT, () => console.log("Listeing port 8080"));
