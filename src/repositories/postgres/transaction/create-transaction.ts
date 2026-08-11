import { prisma } from "../../../../prisma/prisma.js";
import type { Transaction } from "../../../entities/transaction.entity.js";
import type { CreateTransactionRepositoryInterface } from "../../interfaces/transaction/create-transaction.js";

export class PostgresCreateTransactionRepository implements CreateTransactionRepositoryInterface {
  async execute(createTransactionParams: Transaction): Promise<Transaction> {
    const transaction = await prisma.transaction.create({
      data: {
        ...createTransactionParams,
      },
    });

    return {
      ...transaction,
      date: transaction.date.toISOString(),
      amount: transaction.amount.toNumber(),
    };
  }
}
