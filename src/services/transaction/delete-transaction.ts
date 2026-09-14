import type { Transaction } from "../../entities/transaction.entity.js";
import type { DeleteTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/delete-transaction.js";
import type { DeleteTransactionServiceInterface } from "../interfaces/transaction/delete-transaction.js";

export class DeleteTransactionService implements DeleteTransactionServiceInterface {
  constructor(private readonly deleteTransactionRepository: DeleteTransactionRepositoryInterface) {}
  async execute(transactionId: string): Promise<Transaction | null> {
    const transaction = await this.deleteTransactionRepository.execute(transactionId);
    return transaction;
  }
}
