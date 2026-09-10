import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import { GetTransactionByUserIdService } from "./get-transaction-by-user-id.js";
import type { GetTransactionByUserIdInterface } from "../../repositories/interfaces/transaction/get-transaction-by-user-id.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import type { Transaction } from "../../entities/transaction.entity.js";
import type { User } from "../../entities/user.entity.js";
import { TransactionType } from "../../generated/prisma/enums.js";
import { UserNotFoundError } from "../../erros/userId.js";

describe("GetTransactionByUserIdService", () => {
  class GetTransactionByUserIdRepositoryStub implements GetTransactionByUserIdInterface {
    async execute(): Promise<Transaction[]> {
      return [
        {
          id: faker.string.uuid(),
          userId: faker.string.uuid(),
          title: faker.string.alpha({ length: 10 }),
          date: faker.date.future().toISOString().slice(0, 10),
          amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
          type: faker.helpers.arrayElement(Object.values(TransactionType)),
        },
      ];
    }
  }

  class GetUserByIdRepositoryStub implements GetUserByIdRepositoryInterface {
    async execute(): Promise<User | null> {
      return {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      };
    }
  }

  const makeSut = () => {
    const getTransactionByUserIdRepository = new GetTransactionByUserIdRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetTransactionByUserIdService(
      getTransactionByUserIdRepository,
      getUserByIdRepository,
    );
    return { sut, getTransactionByUserIdRepository, getUserByIdRepository };
  };

  it("should return transactions for a user", async () => {
    const { sut } = makeSut();
    const userId = faker.string.uuid();

    const result = await sut.execute(userId);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]!).toHaveProperty("id");
    expect(result[0]!).toHaveProperty("title");
    expect(result[0]!).toHaveProperty("amount");
    expect(result[0]!).toHaveProperty("type");
  });

  it("should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);

    const promise = sut.execute(userId);

    await expect(promise).rejects.toThrow(UserNotFoundError);
    await expect(promise).rejects.toThrow(`O id: ${userId} não existe.`);
  });

  it("should call GetUserByIdRepository with correct userId", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should call GetTransactionByUserIdRepository with correct userId", async () => {
    const { sut, getTransactionByUserIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const executeSpy = jest.spyOn(getTransactionByUserIdRepository, "execute");

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should return empty array if user has no transactions", async () => {
    const { sut, getTransactionByUserIdRepository } = makeSut();
    const userId = faker.string.uuid();
    jest.spyOn(getTransactionByUserIdRepository, "execute").mockResolvedValueOnce([]);

    const result = await sut.execute(userId);

    expect(result).toEqual([]);
  });

  it("should return multiple transactions", async () => {
    const { sut, getTransactionByUserIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const mockTransactions: Transaction[] = [
      {
        id: faker.string.uuid(),
        userId,
        title: "Transaction 1",
        date: "2024-01-01",
        amount: 100,
        type: TransactionType.EARNING,
      },
      {
        id: faker.string.uuid(),
        userId,
        title: "Transaction 2",
        date: "2024-01-02",
        amount: 50,
        type: TransactionType.EXPENSE,
      },
    ];
    jest.spyOn(getTransactionByUserIdRepository, "execute").mockResolvedValueOnce(mockTransactions);

    const result = await sut.execute(userId);

    expect(result).toHaveLength(2);
    expect(result[0]!.title).toBe("Transaction 1");
    expect(result[1]!.title).toBe("Transaction 2");
  });
});
