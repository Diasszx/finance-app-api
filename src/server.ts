import "dotenv/config.js";
import express, { type Request, type Response } from "express";
import { PostgresHelper } from "./db/postgres/helper.js";
import { CreateUserController } from "./controllers/create-user.js";
import { GetUserByIdController } from "./controllers/get-user-by-id.js";
import { type GetUserByIdParamsDTO } from "./schemas/users/get-user-by-id.schema.js";
import { UpdateUserController } from "./controllers/update-user.js";
import { DeleteUserController } from "./controllers/delete-user.js";
import { PostgresGetUserByIdRepository } from "./repositories/postgres/get-user-by-id.js";
import { GetUserByIdService } from "./services/get-user-by-id.js";
import { CreateUserService } from "./services/create-user.js";
import { PostgresCreateUserRepository } from "./repositories/postgres/create-user.js";
import { PostgresGetUserByEmailRepository } from "./repositories/postgres/get-user-by-email.js";
import { PostgresUpdateUserRepository } from "./repositories/postgres/update-user.js";
import { UpdateUserService } from "./services/update-users.js";
import { PostgresDeleteUserRepository } from "./repositories/postgres/delete-user.js";
import { DeleteUserService } from "./services/delete-user.js";

const app = express();
app.use(express.json());

app.get("/api/users/:userId", async (req: Request<GetUserByIdParamsDTO>, res: Response) => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserByIdService = new GetUserByIdService(getUserByIdRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdService);
  await getUserByIdController.execute(req, res);
});

app.post("/api/users", async (req: Request, res: Response) => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const createUserService = new CreateUserService(createUserRepository, getUserByEmailRepository);
  const createUserController = new CreateUserController(createUserService);
  await createUserController.execute(req, res);
});

app.patch("/api/users/:userId", async (req: Request, res: Response) => {
  const updateUserRepository = new PostgresUpdateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const updateUserService = new UpdateUserService(updateUserRepository, getUserByEmailRepository);
  const updateUserController = new UpdateUserController(updateUserService);
  await updateUserController.execute(req, res);
});

// rota temp de delete, implementar validacao depois
app.delete("/api/users/:userId", async (req: Request<GetUserByIdParamsDTO>, res: Response) => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const deleteUserService = new DeleteUserService(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserService);
  await deleteUserController.execute(req, res);
});

// rota teste
app.get("/api/users", async (req: Request, res: Response) => {
  const users = await PostgresHelper.query("SELECT * FROM users;");
  return res.json(users);
});

app.listen(process.env.PORT, () => console.log("Listeing port 8080"));
