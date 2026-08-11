import { prisma } from "../../../../prisma/prisma.js";
import type { Balance } from "../../../entities/balance.entity.js";
import type { TransactionType } from "../../../generated/prisma/enums.js";
import { decimalToNumber } from "../../../utils/decimal-to-number.js";
import type { GetUserBalanceInterface } from "../../interfaces/user/get-user-balance.js";

export class PostgresGetUserBalanceRepository implements GetUserBalanceInterface {
  async execute(userId: string): Promise<Balance> {
    const [expensesSum, earningsSum, investmentsSum] = await Promise.all([
      this.sumTransactionsByType(userId, "EXPENSE"),
      this.sumTransactionsByType(userId, "EARNING"),
      this.sumTransactionsByType(userId, "INVESTMENT"),
    ]);

    const earnings = decimalToNumber(earningsSum);
    const expenses = decimalToNumber(expensesSum);
    const investments = decimalToNumber(investmentsSum);

    const balance = {
      userId,
      earnings,
      expenses,
      investments,
      balance: earnings - expenses - investments,
    };

    return balance;
  }

  private async sumTransactionsByType(userId: string, type: TransactionType) {
    const { _sum } = await prisma.transaction.aggregate({
      where: {
        userId,
        type,
      },
      _sum: {
        amount: true,
      },
    });

    return _sum.amount;
  }
}
