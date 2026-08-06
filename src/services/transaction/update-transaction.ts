import type { Transaction } from "../../entities/transaction.entity.js";
import type { UpdateTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/update-transaction.js";
import type { UpdateTransactionDTO } from "../../schemas/transaction/update-transaction.schema.js";
import type { UpdateTransactionServiceInterface } from "../interfaces/transaction/update-transaction.js";

export class UpdateTransactionService implements UpdateTransactionServiceInterface {
  constructor(private readonly updateTransactionRepository: UpdateTransactionRepositoryInterface) {}
  async execute(
    transactionId: string,
    updateTransaction: UpdateTransactionDTO,
  ): Promise<Transaction | null> {
    const transaction = this.updateTransactionRepository.execute(transactionId, updateTransaction);
    return transaction;
  }
}
