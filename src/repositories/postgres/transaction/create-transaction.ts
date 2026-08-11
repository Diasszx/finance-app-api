import { prisma } from "../../../../prisma/prisma.js";
import type { Transaction } from "../../../entities/transaction.entity.js";
import type { CreateTransactionRepositoryInterface } from "../../interfaces/transaction/create-transaction.js";

export class PostgresCreateTransactionRepository implements CreateTransactionRepositoryInterface {
  async execute(createTransactionParams: Transaction): Promise<Transaction> {
    const transaction = await prisma.transaction.create({
      data: {
        id: createTransactionParams.id,
        userId: createTransactionParams.userId,
        title: createTransactionParams.title,
        date: createTransactionParams.date,
        amount: createTransactionParams.amount,
        type: createTransactionParams.type,
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
