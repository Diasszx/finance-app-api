import type { Transaction } from "../../../entities/transaction.entity.js";
import type { CreateTransactionDTO } from "../../../schemas/transaction/create-transaction.schema.js";

export interface CreateTransactionServiceInterface {
  execute(userId: string, transaction: CreateTransactionDTO): Promise<Transaction>;
}
