import type { Transaction } from "../../../entities/transaction.entity.js";

export interface GetTransactionByIdServiceInterface {
  execute(userId: string): Promise<Transaction[] | null>;
}
