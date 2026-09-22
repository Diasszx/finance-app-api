import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import { prisma } from "../../../../prisma/prisma.js";
import { TransactionType } from "../../../generated/prisma/enums.js";
import { user as fakeUser } from "../../../tests/index.js";
import { PostgresGetUserBalanceRepository } from "./get-user-balance.js";

describe("PostgresGetUserBalanceRepository", () => {
  it("should get user balance on db", async () => {
    const user = await prisma.user.create({ data: fakeUser });

    await prisma.transaction.createMany({
      data: [
        {
          title: faker.string.sample(),
          amount: 5000,
          date: new Date("2024-01-01"),
          type: TransactionType.EARNING,
          userId: user.id,
        },
        {
          title: faker.string.sample(),
          amount: 5000,
          date: new Date("2024-01-01"),
          type: TransactionType.EARNING,
          userId: user.id,
        },
        {
          title: faker.string.sample(),
          amount: 1000,
          date: new Date("2024-01-01"),
          type: TransactionType.EXPENSE,
          userId: user.id,
        },
        {
          title: faker.string.sample(),
          amount: 1000,
          date: new Date("2024-01-31"),
          type: TransactionType.EXPENSE,
          userId: user.id,
        },
        {
          title: faker.string.sample(),
          amount: 3000,
          date: new Date("2024-01-31"),
          type: TransactionType.INVESTMENT,
          userId: user.id,
        },
        {
          title: faker.string.sample(),
          amount: 3000,
          date: new Date("2024-01-31"),
          type: TransactionType.INVESTMENT,
          userId: user.id,
        },
      ],
    });

    const sut = new PostgresGetUserBalanceRepository();

    const result = await sut.execute(user.id);

    expect(result).toStrictEqual({
      userId: user.id,
      earnings: 10000,
      expenses: 2000,
      investments: 6000,
      balance: 2000,
    });
  });

  it("should call Prisma with correct params", async () => {
    const sut = new PostgresGetUserBalanceRepository();
    const prismaSpy = jest.spyOn(prisma.transaction, "aggregate");

    await sut.execute(fakeUser.id);

    expect(prismaSpy).toHaveBeenCalledTimes(3);
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        userId: fakeUser.id,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        userId: fakeUser.id,
        type: TransactionType.EARNING,
      },
      _sum: {
        amount: true,
      },
    });
    expect(prismaSpy).toHaveBeenCalledWith({
      where: {
        userId: fakeUser.id,
        type: TransactionType.INVESTMENT,
      },
      _sum: {
        amount: true,
      },
    });
  });

  it("should throw if Prisma throws", async () => {
    const sut = new PostgresGetUserBalanceRepository();

    jest.spyOn(prisma.transaction, "aggregate").mockRejectedValueOnce(new Error());

    const promise = sut.execute(fakeUser.id);

    await expect(promise).rejects.toThrow();
  });
});
