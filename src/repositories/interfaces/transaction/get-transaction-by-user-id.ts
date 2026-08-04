import type { Transaction } from "../../../entities/transaction.entity.js";

export interface GetTransactionByUserId {
  execute(userId: string): Promise<Transaction[] | null>;
}
