import type { Balance } from "../../../entities/balance.entity.js";

export interface GetUserBalanceServiceInterface {
  execute(userId: string): Promise<Balance | null>;
}
