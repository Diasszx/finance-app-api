import { PostgresHelper } from "../../../db/postgres/helper.js";

export class PostgresGetUserBalanceRepository {
  async execute(userId: string) {
    const result = await PostgresHelper.query(
      `SELECT 
            SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) AS earnings,
            SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expenses,
            SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS investments,
            (
                SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END)
                - SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END)
                - SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END)
            ) AS balance
            FROM transaction;
            WHERE user_id = $1`,
      [userId],
    );

    return {
      userId,
      ...result,
    };
  }
}
