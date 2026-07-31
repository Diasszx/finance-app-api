import { PostgresHelper } from "../../../db/postgres/helper.js";
import type { Transaction } from "../../../entities/transaction.entity.js";

export class PostgresCreateTransactionRepository {
  async execute(transaction: Transaction): Promise<Transaction> {
    const result = await PostgresHelper.query<Transaction>(
      "INSERT INTO transaction(ID, user_id, name, date, amount, type) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;",
      [
        transaction.id,
        transaction.userId,
        transaction.name,
        transaction.date,
        transaction.amount,
        transaction.type,
      ],
    );
    const [createdTransaction] = result;
    if (!createdTransaction) {
      throw new Error("Falha ao criar transação.");
    }

    return createdTransaction;
  }
}
