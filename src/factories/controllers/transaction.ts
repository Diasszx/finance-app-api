import {
  PostgresCreateTransactionRepository,
  PostgresGetTransactionByUserIdRepository,
  PostgresGetUserByIdRepository,
} from "../../repositories/index.js";
import { CreateTransactionService, GetTransactionByUserIdService } from "../../services/index.js";
import {
  CreateTransactionController,
  GetTransactionsByUserIdController,
} from "../../controllers/index.js";

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const createTransactionService = new CreateTransactionService(
    createTransactionRepository,
    getUserByIdRepository,
  );
  const createTransactionController = new CreateTransactionController(createTransactionService);

  return createTransactionController;
};

export const makeGetTransactionByUserIDController = () => {
  const getTransactionByUserIdRepository = new PostgresGetTransactionByUserIdRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getTransactionByUserIdService = new GetTransactionByUserIdService(
    getTransactionByUserIdRepository,
    getUserByIdRepository,
  );
  const getTransactionByUserIdController = new GetTransactionsByUserIdController(
    getTransactionByUserIdService,
  );

  return getTransactionByUserIdController;
};
