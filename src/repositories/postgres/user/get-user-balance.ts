import { PostgresHelper } from "../../../db/postgres/helper.js";
import type { Balance } from "../../../entities/balance.entity.js";
import type { GetUserBalanceInterface } from "../../interfaces/user/get-user-balance.js";

export class PostgresGetUserBalanceRepository implements GetUserBalanceInterface {
  async execute(userId: string): Promise<Balance> {
    const [balance] = await PostgresHelper.query<Balance>(
      `SELECT 
            SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) AS earnings,
            SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expenses,
            SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS investments,
            (
                SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END)
                - SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END)
                - SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END)
            ) AS balance
            FROM transaction
            WHERE user_id = $1`,
      [userId],
    );
    if (!balance) {
      throw new Error("Balance not found");
    }
    return {
      userId,
      earnings: Number(balance.earnings),
      expenses: Number(balance.expenses),
      investments: Number(balance.investments),
      balance: Number(balance.balance),
    };
  }
}
