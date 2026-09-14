import type { Transaction } from "../../entities/transaction.entity.js";
import { UserNotFoundError } from "../../erros/userId.js";
import type { CreateTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/create-transaction.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import type { CreateTransactionDTO } from "../../schemas/transaction/create-transaction.schema.js";
import type { CreateTransactionServiceInterface } from "../interfaces/transaction/create-transaction.js";
import { IdGeneratorAdapter } from "../../adapters/id-generator.js";

export class CreateTransactionService implements CreateTransactionServiceInterface {
  constructor(
    private readonly createTransactionRepository: CreateTransactionRepositoryInterface,
    private readonly getUserByIdRepository: GetUserByIdRepositoryInterface,
    private readonly idGeneratorAdapter: IdGeneratorAdapter,
  ) {}
  async execute(userId: string, transaction: CreateTransactionDTO): Promise<Transaction> {
    const userIdExists = await this.getUserByIdRepository.execute(userId);
    if (!userIdExists) {
      throw new UserNotFoundError(userId);
    }
    const transactionEntity: Transaction = {
      ...transaction,
      id: this.idGeneratorAdapter.execute(),
      userId,
    };
    const createdTransaction = await this.createTransactionRepository.execute(transactionEntity);

    return createdTransaction;
  }
}
