import type { Transaction } from "../../../entities/transaction.entity.js";

export interface UpdateTransactionRepositoryInterface {
  execute(userId: string, updateTransaction: Transaction): Promise<Transaction>;
}
