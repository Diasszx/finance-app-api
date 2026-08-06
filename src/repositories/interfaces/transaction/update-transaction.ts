import type { Transaction } from "../../../entities/transaction.entity.js";
import type { UpdateTransactionDTO } from "../../../schemas/transaction/update-transaction.schema.js";

export interface UpdateTransactionRepositoryInterface {
  execute(transactionId: string, updateTransaction: UpdateTransactionDTO): Promise<Transaction>;
}
