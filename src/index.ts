import "dotenv/config.js";
import express from "express";
import { PostgresHelper } from "./db/postgres/helper.js";

const app = express();

app.get("/", async (req, res) => {
  const users = await PostgresHelper.query("SELECT * FROM users;");
  return res.json(users);
});

app.listen(3000, () => console.log("Listeing port 3000"));
