import type { Transaction } from "../../../entities/transaction.entity.js";

export interface CreateTransactionRepositoryInterface {
  execute(data: Transaction): Promise<Transaction>;
}
