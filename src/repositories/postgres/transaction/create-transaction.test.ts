import { jest } from "@jest/globals";
import { prisma } from "../../../../prisma/prisma.js";
import { transaction as fakeTransaction } from "../../../tests/fixtures/transaction.js";
import { user as fakeUser } from "../../../tests/fixtures/user.js";
import { PostgresCreateTransactionRepository } from "./create-transaction.js";

describe("PostgresCreateTransactionRepository", () => {
  it("should create a transaction on db", async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const transaction = { ...fakeTransaction, userId: user.id };
    const sut = new PostgresCreateTransactionRepository();

    const result = await sut.execute(transaction);

    expect(result).toStrictEqual({
      ...transaction,
      date: new Date(transaction.date).toISOString(),
    });
  });

  it("should call Prisma with correct params", async () => {
    const user = await prisma.user.create({ data: fakeUser });
    const transaction = { ...fakeTransaction, userId: user.id };
    const sut = new PostgresCreateTransactionRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, "create");

    await sut.execute(transaction);

    expect(prismaSpy).toHaveBeenCalledWith({
      data: {
        ...transaction,
        date: new Date(transaction.date),
      },
    });
  });

  it("should throw if Prisma throws", async () => {
    const sut = new PostgresCreateTransactionRepository();
    jest.spyOn(prisma.transaction, "create").mockRejectedValueOnce(new Error());

    const promise = sut.execute(fakeTransaction);

    await expect(promise).rejects.toThrow();
  });
});
