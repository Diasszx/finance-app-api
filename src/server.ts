import "dotenv/config.js";
import express, { type Request, type Response } from "express";
import { PostgresHelper } from "./db/postgres/helper.js";
import { CreateUserController } from "./controllers/create-user.js";
import { GetUserByIdController } from "./controllers/get-user-by-id.js";
import { type GetUserByIdParamsDTO } from "./schemas/users/get-user-by-id.schema.js";
import { UpdateUserController } from "./controllers/update-user.js";

const app = express();
app.use(express.json());

app.get("/api/users/:userId", async (req: Request<GetUserByIdParamsDTO>, res: Response) => {
  const getUserByIdController = new GetUserByIdController();
  await getUserByIdController.execute(req, res);
});

app.post("/api/users", async (req: Request, res: Response) => {
  const createUserController = new CreateUserController();
  await createUserController.execute(req, res);
});

app.patch("/api/users/:userId", async (req: Request, res: Response) => {
  const updateUserController = new UpdateUserController();
  await updateUserController.execute(req, res);
});

// rota teste
app.get("/api/users", async (req: Request, res: Response) => {
  const users = await PostgresHelper.query("SELECT * FROM users;");
  return res.json(users);
});

app.listen(process.env.PORT, () => console.log("Listeing port 8080"));
