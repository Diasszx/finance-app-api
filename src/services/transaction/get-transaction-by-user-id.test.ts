import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import type { Transaction } from "../../entities/transaction.entity.js";
import { UserNotFoundError } from "../../erros/userId.js";
import type { GetTransactionByUserIdInterface } from "../../repositories/interfaces/transaction/get-transaction-by-user-id.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import { TransactionType } from "../../generated/prisma/enums.js";
import { GetTransactionByUserIdService } from "./get-transaction-by-user-id.js";

describe("GetTransactionByUserIdService", () => {
  const user = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: "hashed_password",
  };

  const transactions: Transaction[] = [
    {
      id: faker.string.uuid(),
      userId: user.id,
      title: faker.string.alpha({ length: 10 }),
      date: faker.date.future().toISOString().slice(0, 10),
      amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
      type: faker.helpers.arrayElement(Object.values(TransactionType)),
    },
  ];

  class GetTransactionsByUserIdRepositoryStub implements GetTransactionByUserIdInterface {
    async execute(): Promise<Transaction[] | null> {
      return transactions;
    }
  }

  class GetUserByIdRepositoryStub implements GetUserByIdRepositoryInterface {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getTransactionByUserIdRepository = new GetTransactionsByUserIdRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetTransactionByUserIdService(
      getTransactionByUserIdRepository,
      getUserByIdRepository,
    );

    return {
      sut,
      getTransactionByUserIdRepository,
      getUserByIdRepository,
    };
  };

  it("should get transactions by user id successfully", async () => {
    const { sut } = makeSut();
    const userId = faker.string.uuid();

    const result = await sut.execute(userId);

    expect(result).toEqual(transactions);
  });

  it("should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);
    const userId = faker.string.uuid();

    const promise = sut.execute(userId);

    await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const getUserByIdRepositorySpy = jest.spyOn(getUserByIdRepository, "execute");
    const userId = faker.string.uuid();

    await sut.execute(userId);

    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId);
  });

  it("should call GetTransactionByUserIdRepository with correct params", async () => {
    const { sut, getTransactionByUserIdRepository } = makeSut();
    const getTransactionByUserIdRepositorySpy = jest.spyOn(
      getTransactionByUserIdRepository,
      "execute",
    );
    const userId = faker.string.uuid();

    await sut.execute(userId);

    expect(getTransactionByUserIdRepositorySpy).toHaveBeenCalledWith(userId);
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockRejectedValueOnce(new Error());
    const userId = faker.string.uuid();

    const promise = sut.execute(userId);

    await expect(promise).rejects.toThrow();
  });

  it("should throw if GetTransactionByUserIdRepository throws", async () => {
    const { sut, getTransactionByUserIdRepository } = makeSut();
    jest.spyOn(getTransactionByUserIdRepository, "execute").mockRejectedValueOnce(new Error());
    const userId = faker.string.uuid();

    const promise = sut.execute(userId);

    await expect(promise).rejects.toThrow();
  });
});
