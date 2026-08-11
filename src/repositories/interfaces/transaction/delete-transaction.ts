import type { Transaction } from "../../../generated/prisma/client.js";

export interface DeleteTransactionRepositoryInterface {
  execute(transactionId: string): Promise<Transaction | null>;
}
