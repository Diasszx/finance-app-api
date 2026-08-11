import type { Transaction } from "../../../generated/prisma/client.js";

export interface DeleteTransactionServiceInterface {
  execute(transactionId: string): Promise<Transaction | null>;
}
