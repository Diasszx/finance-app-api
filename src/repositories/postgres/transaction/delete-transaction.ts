import { prisma } from "../../../../prisma/prisma.js";
import type { Transaction } from "../../../generated/prisma/client.js";
import type { DeleteTransactionInterface } from "../../interfaces/transaction/delete-transaction.js";

export class PostgresDeleteTransactionRepository implements DeleteTransactionInterface {
  async execute(transactionId: string): Promise<Transaction | null> {
    return await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });
  }
}
