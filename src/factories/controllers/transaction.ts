import {
  PostgresCreateTransactionRepository,
  PostgresGetTransactionByUserIdRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateTransactionsRepository,
} from "../../repositories/index.js";
import {
  CreateTransactionService,
  GetTransactionByUserIdService,
  UpdateTransactionService,
} from "../../services/index.js";
import {
  CreateTransactionController,
  GetTransactionsByUserIdController,
  UpdateTransactionController,
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

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionsRepository();
  const updateTransactionService = new UpdateTransactionService(updateTransactionRepository);
  const updateTransactionController = new UpdateTransactionController(updateTransactionService);
  return updateTransactionController;
};
