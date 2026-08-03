import {
  PostgresCreateTransactionRepository,
  PostgresGetUserByIdRepository,
} from "../../repositories/index.js";
import { CreateTransactionService } from "../../services/index.js";
import { CreateTransactionController } from "../../controllers/index.js";

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
