import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  UpdateUserController,
} from "../controllers/index.js";
import {
  PostgresCreateUserRepository,
  PostgresDeleteUserRepository,
  PostgresGetUserByEmailRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateUserRepository,
} from "../repositories/index.js";

import {
  CreateUserService,
  DeleteUserService,
  GetUserByIdService,
  UpdateUserService,
} from "../services/index.js";
import { PasswordHasherAdapter, IdGeneratorAdapter } from "../adapters/index.js";

export const makeGetUserByIdController = () => {
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserByIdService = new GetUserByIdService(getUserByIdRepository);
  const getUserByIdController = new GetUserByIdController(getUserByIdService);

  return getUserByIdController;
};

export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const passwordHasher = new PasswordHasherAdapter();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const createUserService = new CreateUserService(
    createUserRepository,
    getUserByEmailRepository,
    passwordHasher,
    idGeneratorAdapter,
  );
  const createUserController = new CreateUserController(createUserService);

  return createUserController;
};

export const makeUpdateUserController = () => {
  const updateUserRepository = new PostgresUpdateUserRepository();
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const passwordHasher = new PasswordHasherAdapter();
  const updateUserService = new UpdateUserService(
    updateUserRepository,
    getUserByEmailRepository,
    passwordHasher,
  );
  const updateUserController = new UpdateUserController(updateUserService);

  return updateUserController;
};

export const makeDeleteUserController = () => {
  const deleteUserRepository = new PostgresDeleteUserRepository();
  const deleteUserService = new DeleteUserService(deleteUserRepository);
  const deleteUserController = new DeleteUserController(deleteUserService);

  return deleteUserController;
};
