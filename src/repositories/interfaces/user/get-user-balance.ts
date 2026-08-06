import type { Balance } from "../../../entities/balance.entity.js";

export interface GetUserBalanceInterface {
  execute(userId: string): Promise<Balance>;
}
