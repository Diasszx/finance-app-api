import { jest } from "@jest/globals";
import { prisma } from "../../../../prisma/prisma.js";
import { transaction as fakeTransaction } from "../../../tests/fixtures/transaction.js";
import { user as fakeUser } from "../../../tests/fixtures/user.js";
import { PostgresDeleteTransactionRepository } from "./delete-transaction.js";

describe("PostgresDeleteTransactionRepository", () => {
  it("should delete a transaction on db", async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const transaction = { ...fakeTransaction, userId: user.id };
    await prisma.transaction.create({
      data: {
        ...transaction,
        date: new Date(transaction.date),
      },
    });
    const sut = new PostgresDeleteTransactionRepository();

    const result = await sut.execute(transaction.id);

    expect(result).toStrictEqual({
      ...transaction,
      date: new Date(transaction.date).toISOString(),
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
    const sut = new PostgresDeleteTransactionRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, "delete");

    await sut.execute(transaction.id);

    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        id: transaction.id,
      },
    });
  });

  it("should throw if Prisma throws", async () => {
    const sut = new PostgresDeleteTransactionRepository();
    jest.spyOn(prisma.transaction, "delete").mockRejectedValueOnce(new Error());

    const promise = sut.execute(fakeTransaction.id);

    await expect(promise).rejects.toThrow();
  });
});
