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
import { PostgresGetUserBalanceRepository } from "../../repositories/postgres/user/get-user-balance.js";
import { GetUserBalanceService } from "../../services/interfaces/user/get-user-balance.js";
import { GetUserBalanceController } from "../../controllers/users/get-user-balance.js";

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
