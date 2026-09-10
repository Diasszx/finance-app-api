import type { Transaction } from "../../../entities/transaction.entity.js";

export interface DeleteTransactionServiceInterface {
  execute(transactionId: string): Promise<Transaction | null>;
}
