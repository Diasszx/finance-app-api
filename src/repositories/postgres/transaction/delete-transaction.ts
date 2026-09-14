import { prisma } from "../../../../prisma/prisma.js";
import type { Transaction } from "../../../entities/transaction.entity.js";
import type { DeleteTransactionRepositoryInterface } from "../../interfaces/transaction/delete-transaction.js";

export class PostgresDeleteTransactionRepository implements DeleteTransactionRepositoryInterface {
  async execute(transactionId: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    return {
      id: transaction.id,
      userId: transaction.userId,
      title: transaction.title,
      date: transaction.date.toISOString(),
      amount: transaction.amount.toNumber(),
      type: transaction.type,
    };
  }
}
