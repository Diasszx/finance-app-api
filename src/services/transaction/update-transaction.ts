import type { Transaction } from "../../entities/transaction.entity.js";
import { UserNotFoundError } from "../../erros/userId.js";
import type { UpdateTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/update-transaction.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import type { UpdateTransactionDTO } from "../../schemas/transaction/update-transaction.schema.js";
import type { UpdateTransactionServiceInterface } from "../interfaces/transaction/update-transaction.js";

export class UpdateTransactionService implements UpdateTransactionServiceInterface {
  constructor(
    private readonly updateTransactionRepository: UpdateTransactionRepositoryInterface,
    private readonly getUserByIdRepository: GetUserByIdRepositoryInterface,
  ) {}
  async execute(
    userId: string,
    updateTransaction: UpdateTransactionDTO,
  ): Promise<Transaction | null> {
    const user = await this.getUserByIdRepository.execute(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    const transaction = this.updateTransactionRepository.execute(userId, updateTransaction);
    return transaction;
  }
}
