import { PostgresHelper } from "../../../db/postgres/helper.js";
import type { Transaction } from "../../../entities/transaction.entity.js";
import type { GetTransactionByUserIdInterface } from "../../interfaces/transaction/get-transaction-by-user-id.js";

export class PostgresGetTransactionByUserIdRepository implements GetTransactionByUserIdInterface {
  async execute(userId: string): Promise<Transaction[]> {
    const transactions = await PostgresHelper.query<Transaction>(
      `
        SELECT * FROM transaction where id = $1,
        `,
      [userId],
    );

    return transactions ?? null;
  }
}
