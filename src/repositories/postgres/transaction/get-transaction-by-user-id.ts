import { prisma } from "../../../../prisma/prisma.js";
import type { Transaction } from "../../../entities/transaction.entity.js";
import type { GetTransactionByUserIdInterface } from "../../interfaces/transaction/get-transaction-by-user-id.js";

export class PostgresGetTransactionByUserIdRepository implements GetTransactionByUserIdInterface {
  async execute(userId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({ where: { userId } });
    return transactions.map((transaction) => ({
      ...transaction,
      date: transaction.date.toISOString(),
      amount: transaction.amount.toNumber(),
    }));
  }
}
