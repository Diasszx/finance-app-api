import type { Transaction } from "../../../generated/prisma/client.js";

export interface DeleteTransactionInterface {
  execute(transactionId: string): Promise<Transaction | null>;
}
