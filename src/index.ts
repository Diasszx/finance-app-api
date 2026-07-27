import "dotenv/config.js";
import express, { type Request, type Response } from "express";
import { PostgresHelper } from "./db/postgres/helper.js";
import { CreateUserController } from "./controllers/create-user.js";

const app = express();

app.post("/api/users", async (request: Request, response: Response) => {
  const createUserController = new CreateUserController();
  await createUserController.execute(request, response);
});

app.get("/api/users", async (req, res) => {
  const users = await PostgresHelper.query("SELECT * FROM users;");
  return res.json(users);
});

app.listen(process.env.PORT, () => console.log("Listeing port 8080"));
