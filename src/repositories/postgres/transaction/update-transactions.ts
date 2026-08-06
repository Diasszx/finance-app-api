import { PostgresHelper } from "../../../db/postgres/helper.js";
import type { Transaction } from "../../../entities/transaction.entity.js";
import type { UpdateTransactionDTO } from "../../../schemas/transaction/update-transaction.schema.js";
import type { UpdateTransactionRepositoryInterface } from "../../interfaces/transaction/update-transaction.js";

export class PostgresUpdateTransactionsRepository implements UpdateTransactionRepositoryInterface {
  async execute(
    transactionId: string,
    updateTransaction: UpdateTransactionDTO,
  ): Promise<Transaction> {
    const updateFields: string[] = [];
    const updateValues: unknown[] = [];
    const fieldMap: Record<keyof UpdateTransactionDTO, string> = {
      title: "name",
      date: "date",
      amount: "amount",
      type: "type",
    };
    for (const [key, value] of Object.entries(updateTransaction) as [
      keyof UpdateTransactionDTO,
      UpdateTransactionDTO[keyof UpdateTransactionDTO],
    ][]) {
      if (value === undefined) continue;

      const dbField = fieldMap[key];

      updateFields.push(`${dbField} = $${updateValues.length + 1}`);
      updateValues.push(value);
    }
    if (updateFields.length === 0) {
      throw new Error("Nenhum campo para atualizar.");
    }
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
