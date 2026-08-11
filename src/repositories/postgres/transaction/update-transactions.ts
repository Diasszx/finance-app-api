import { prisma } from "../../../../prisma/prisma.js";
import type { Transaction } from "../../../entities/transaction.entity.js";
import type { UpdateTransactionDTO } from "../../../schemas/transaction/update-transaction.schema.js";
import { stripUndefinedProperties } from "../../../utils/strip-undefined-properties.js";
import type { UpdateTransactionRepositoryInterface } from "../../interfaces/transaction/update-transaction.js";

export class PostgresUpdateTransactionsRepository implements UpdateTransactionRepositoryInterface {
  async execute(
    transactionId: string,
    updateTransactionParams: UpdateTransactionDTO,
  ): Promise<Transaction> {
    const updateTransaction = stripUndefinedProperties(updateTransactionParams);
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: updateTransaction,
    });
    return {
      ...transaction,
      date: transaction.date.toISOString(),
      amount: transaction.amount.toNumber(),
    };
  }
}
