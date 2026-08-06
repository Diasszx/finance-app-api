import type { Transaction } from "../../../entities/transaction.entity.js";
import type { UpdateTransactionDTO } from "../../../schemas/transaction/update-transaction.schema.js";
export interface UpdateTransactionServiceInterface {
  execute(userId: string, updateTransaction: UpdateTransactionDTO): Promise<Transaction | null>;
}
