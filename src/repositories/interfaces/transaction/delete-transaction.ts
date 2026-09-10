import type { Transaction } from "../../../entities/transaction.entity.js";

export interface DeleteTransactionRepositoryInterface {
  execute(transactionId: string): Promise<Transaction | null>;
}
