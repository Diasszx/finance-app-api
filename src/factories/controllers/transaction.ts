import {
  PostgresCreateTransactionRepository,
  PostgresGetTransactionByUserIdRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateTransactionsRepository,
  PostgresGetUserBalanceRepository,
  PostgresDeleteTransactionRepository,
} from "../../repositories/index.js";
import {
  CreateTransactionService,
  GetTransactionByUserIdService,
  UpdateTransactionService,
  DeleteTransactionService,
  GetUserBalanceService,
} from "../../services/index.js";
import {
  CreateTransactionController,
  GetTransactionsByUserIdController,
  UpdateTransactionController,
  GetUserBalanceController,
  DeleteTransactionController,
} from "../../controllers/index.js";
import { IdGeneratorAdapter } from "../../adapters/index.js";

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const createTransactionService = new CreateTransactionService(
    createTransactionRepository,
    getUserByIdRepository,
    idGeneratorAdapter,
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

export const makeDeleteTransactionController = () => {
  const deleteTransactionRepository = new PostgresDeleteTransactionRepository();
  const deleteTransactionService = new DeleteTransactionService(deleteTransactionRepository);
  const deleteTransactionController = new DeleteTransactionController(deleteTransactionService);
  return deleteTransactionController;
};

export const makeUserBalanceController = () => {
  const getUserBalanceRepository = new PostgresGetUserBalanceRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getUserBalanceService = new GetUserBalanceService(
    getUserBalanceRepository,
    getUserByIdRepository,
  );
  const getUserBalanceController = new GetUserBalanceController(getUserBalanceService);
  return getUserBalanceController;
};
