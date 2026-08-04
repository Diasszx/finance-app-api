import type { Transaction } from "../../../entities/transaction.entity.js";

export interface GetTransactionByUserIdInterface {
  execute(userId: string): Promise<Transaction[] | null>;
}
