import "dotenv/config.js";
import express, { type Request, type Response } from "express";
import { PostgresHelper } from "./db/postgres/helper.js";
import { type GetUserByIdParamsDTO } from "./schemas/users/get-user-by-id.schema.js";
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from "./factories/users.js";

const app = express();
app.use(express.json());

app.get("/api/users/:userId", async (req: Request<GetUserByIdParamsDTO>, res: Response) => {
  const getUserByIdController = makeGetUserByIdController();
  await getUserByIdController.execute(req, res);
});

app.post("/api/users", async (req: Request, res: Response) => {
  const createUserController = makeCreateUserController();
  await createUserController.execute(req, res);
});

app.patch("/api/users/:userId", async (req: Request, res: Response) => {
  const updateUserController = makeUpdateUserController();
  await updateUserController.execute(req, res);
});

// rota temp de delete, implementar validacao depois
app.delete("/api/users/:userId", async (req: Request<GetUserByIdParamsDTO>, res: Response) => {
  const deleteUserController = makeDeleteUserController();
  await deleteUserController.execute(req, res);
});

// rota teste
app.get("/api/users", async (req: Request, res: Response) => {
  const users = await PostgresHelper.query("SELECT * FROM users;");
  return res.json(users);
});

app.listen(process.env.PORT, () => console.log("Listeing port 8080"));
