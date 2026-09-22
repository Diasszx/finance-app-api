import { jest } from "@jest/globals";
import { prisma } from "../../../../prisma/prisma.js";
import { transaction as fakeTransaction } from "../../../tests/fixtures/transaction.js";
import { user as fakeUser } from "../../../tests/fixtures/user.js";
import { PostgresGetTransactionByUserIdRepository } from "./get-transaction-by-user-id.js";

describe("PostgresGetTransactionByUserIdRepository", () => {
  it("should get transactions by user id on db", async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const transaction = { ...fakeTransaction, userId: user.id };
    await prisma.transaction.create({
      data: {
        ...transaction,
        date: new Date(transaction.date),
      },
    });
    const sut = new PostgresGetTransactionByUserIdRepository();

    const result = await sut.execute(user.id);

    expect(result).toStrictEqual([
      {
        ...transaction,
        date: new Date(transaction.date).toISOString(),
      },
    ]);
  });

  it("should call Prisma with correct params", async () => {
    const sut = new PostgresGetTransactionByUserIdRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, "findMany").mockResolvedValueOnce([]);

    await sut.execute(fakeUser.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        userId: fakeUser.id,
      },
    });
  });

  it("should throw if Prisma throws", async () => {
    const sut = new PostgresGetTransactionByUserIdRepository();
    jest.spyOn(prisma.transaction, "findMany").mockRejectedValueOnce(new Error());

    const promise = sut.execute(fakeUser.id);

    await expect(promise).rejects.toThrow();
  });
});
