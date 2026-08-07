import { PostgresHelper } from "../../../db/postgres/helper.js";
import type { Balance } from "../../../entities/balance.entity.js";
import type { GetUserBalanceInterface } from "../../interfaces/user/get-user-balance.js";

export class PostgresGetUserBalanceRepository implements GetUserBalanceInterface {
  async execute(userId: string): Promise<Balance> {
    const [balance] = await PostgresHelper.query<Balance>(`SELECT * FROM get_user_balance($1)`, [
      userId,
    ]);
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
