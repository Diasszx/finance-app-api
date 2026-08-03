import { v4 as uuidv4 } from "uuid";
import type { Transaction } from "../../entities/transaction.entity.js";
import { UserNotFoundError } from "../../erros/userId.js";
import type { CreateTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/create-transaction.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import type { CreateTransactionDTO } from "../../schemas/transaction/create-transaction.schema.js";
import type { CreateTransactionServiceInterface } from "../interfaces/transaction/create-transaction.js";

export class CreateTransactionService implements CreateTransactionServiceInterface {
  constructor(
    private readonly createTransactionRepository: CreateTransactionRepositoryInterface,
    private readonly getUserByIdRepository: GetUserByIdRepositoryInterface,
  ) {}
  async execute(userId: string, transaction: CreateTransactionDTO): Promise<Transaction> {
    const userIdExists = await this.getUserByIdRepository.execute(userId);
    if (!userIdExists) {
      throw new UserNotFoundError(userId);
    }
    const transactionEntity: Transaction = {
      ...transaction,
      id: uuidv4(),
      userId,
    };
    const createdTransaction = await this.createTransactionRepository.execute(transactionEntity);

    return createdTransaction;
  }
}
