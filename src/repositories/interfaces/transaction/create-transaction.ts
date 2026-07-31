import type { Transaction } from "../../../entities/transaction.entity.js";
import type { TransactionType } from "../../../schemas/transaction/transaction-type.schema.js";

export interface CreateTransactionRepositoryInterface {
  execute(data: TransactionType): Promise<Transaction>;
}
