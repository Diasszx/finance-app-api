import type { Transaction } from "../../generated/prisma/client.js";
import type { DeleteTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/delete-transaction.js";
import type { DeleteTransactionServiceInterface } from "../interfaces/transaction/delete-transaction.js";

export class DeleteTransactionService implements DeleteTransactionServiceInterface {
  constructor(private readonly deleteTransactionRepository: DeleteTransactionRepositoryInterface) {}
  async execute(transactionId: string): Promise<Transaction | null> {
    const transaction = await this.deleteTransactionRepository.execute(transactionId);
    return transaction;
  }
}
