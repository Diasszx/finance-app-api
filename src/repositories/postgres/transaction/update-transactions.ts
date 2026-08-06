import { PostgresHelper } from "../../../db/postgres/helper.js";
import type { Transaction } from "../../../entities/transaction.entity.js";
import type { UpdateTransactionRepositoryInterface } from "../../interfaces/transaction/update-transaction.js";

export class PostgresUpdateTransactionsRepository implements UpdateTransactionRepositoryInterface {
  async execute(transactionId: string, updateTransaction: Transaction): Promise<Transaction> {
    const updateFields: string[] = [];
    const updateValues: unknown[] = [];
    Object.keys(updateTransaction).forEach((key) => {
      const typedKey = key as keyof Transaction;

      updateFields.push(`${typedKey} = $${updateValues.length + 1}`);
      updateValues.push(updateTransaction[typedKey]);
    });
    updateValues.push(transactionId);
    const updateQuery = `
        UPDATE transaction
        SET ${updateFields.join(", ")}
        WHERE id = $${updateValues.length}
        RETURNING *
    `;
    const updatedTransaction = await PostgresHelper.query<Transaction>(updateQuery, updateValues);
    const [transaction] = updatedTransaction;
    if (!transaction) {
      throw new Error("Falha ao atualizar usuário.");
    }
    return transaction;
  }
}
