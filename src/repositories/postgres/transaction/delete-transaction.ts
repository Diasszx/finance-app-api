import { prisma } from "../../../../prisma/prisma.js";
import type { Transaction } from "../../../generated/prisma/client.js";
import type { DeleteTransactionRepositoryInterface } from "../../interfaces/transaction/delete-transaction.js";

export class PostgresDeleteTransactionRepository implements DeleteTransactionRepositoryInterface {
  async execute(transactionId: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });
    return transaction ?? null;
  }
}
