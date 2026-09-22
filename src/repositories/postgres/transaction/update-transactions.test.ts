import { jest } from "@jest/globals";
import { prisma } from "../../../../prisma/prisma.js";
import { transaction as fakeTransaction } from "../../../tests/fixtures/transaction.js";
import { user as fakeUser } from "../../../tests/fixtures/user.js";
import { PostgresUpdateTransactionsRepository } from "./update-transactions.js";

describe("PostgresUpdateTransactionsRepository", () => {
  const updateTransactionParams = {
    title: "Updated transaction",
    date: "2026-09-20",
    amount: 250.75,
    type: fakeTransaction.type,
  };

  it("should update a transaction on db", async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const transaction = { ...fakeTransaction, userId: user.id };
    await prisma.transaction.create({
      data: {
        ...transaction,
        date: new Date(transaction.date),
      },
    });
    const sut = new PostgresUpdateTransactionsRepository();

    const result = await sut.execute(transaction.id, updateTransactionParams);

    expect(result).toStrictEqual({
      ...transaction,
      ...updateTransactionParams,
      date: new Date(updateTransactionParams.date).toISOString(),
    });
  });

  it("should call Prisma with correct params", async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const transaction = { ...fakeTransaction, userId: user.id };
    await prisma.transaction.create({
      data: {
        ...transaction,
        date: new Date(transaction.date),
      },
    });
    const sut = new PostgresUpdateTransactionsRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, "update");

    await sut.execute(transaction.id, updateTransactionParams);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
      data: {
        ...updateTransactionParams,
        date: new Date(updateTransactionParams.date),
      },
    });
  });

  it("should throw if Prisma throws", async () => {
    const sut = new PostgresUpdateTransactionsRepository();
    jest.spyOn(prisma.transaction, "update").mockRejectedValueOnce(new Error());

    const promise = sut.execute(fakeTransaction.id, updateTransactionParams);

    await expect(promise).rejects.toThrow();
  });
});
