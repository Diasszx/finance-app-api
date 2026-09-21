import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import type { IdGeneratorInterface } from "../../adapters/interfaces/id-generatorInterface.js";
import type { User } from "../../entities/user.entity.js";
import type { Transaction } from "../../entities/transaction.entity.js";
import { UserNotFoundError } from "../../erros/userId.js";
import type { CreateTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/create-transaction.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import { TransactionType } from "../../generated/prisma/enums.js";
import type { CreateTransactionDTO } from "../../schemas/transaction/create-transaction.schema.js";
import { CreateTransactionService } from "./create-transaction.js";

describe("CreateTransactionService", () => {
  const user: User = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: "hashed_password",
  };

  const transactionParams: CreateTransactionDTO = {
    title: faker.string.alpha({ length: 10 }),
    date: faker.date.future().toISOString().slice(0, 10),
    amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
    type: faker.helpers.arrayElement(Object.values(TransactionType)),
  };

  const transaction: Transaction = {
    ...transactionParams,
    id: "random_id",
    userId: user.id,
  };

  class CreateTransactionRepositoryStub implements CreateTransactionRepositoryInterface {
    async execute(): Promise<Transaction> {
      return transaction;
    }
  }

  class IdGeneratorAdapterStub implements IdGeneratorInterface {
    execute(): string {
      return "random_id";
    }
  }

  class GetUserByIdRepositoryStub implements GetUserByIdRepositoryInterface {
    async execute(): Promise<User | null> {
      return user;
    }
  }

  const makeSut = () => {
    const createTransactionRepository = new CreateTransactionRepositoryStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new CreateTransactionService(
      createTransactionRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    );

    return {
      sut,
      createTransactionRepository,
      idGeneratorAdapter,
      getUserByIdRepository,
    };
  };

  it("should create transaction successfully", async () => {
    const { sut } = makeSut();
    const userId = faker.string.uuid();

    const result = await sut.execute(userId, transactionParams);

    expect(result).toEqual(transaction);
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const getUserByIdRepositorySpy = jest.spyOn(getUserByIdRepository, "execute");
    const userId = faker.string.uuid();

    await sut.execute(userId, transactionParams);

    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(userId);
  });

  it("should call IdGeneratorAdapter", async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, "execute");

    await sut.execute(faker.string.uuid(), transactionParams);

    expect(idGeneratorAdapterSpy).toHaveBeenCalled();
  });

  it("should call CreateTransactionRepository with correct params", async () => {
    const { sut, createTransactionRepository } = makeSut();
    const createTransactionRepositorySpy = jest.spyOn(createTransactionRepository, "execute");
    const userId = faker.string.uuid();

    await sut.execute(userId, transactionParams);

    expect(createTransactionRepositorySpy).toHaveBeenCalledWith({
      ...transactionParams,
      id: "random_id",
      userId,
    });
  });

  it("should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);
    const userId = faker.string.uuid();

    const promise = sut.execute(userId, transactionParams);

    await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockRejectedValueOnce(new Error());

    const promise = sut.execute(faker.string.uuid(), transactionParams);

    await expect(promise).rejects.toThrow();
  });

  it("should throw if IdGeneratorAdapter throws", async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    jest.spyOn(idGeneratorAdapter, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.execute(faker.string.uuid(), transactionParams);

    await expect(promise).rejects.toThrow();
  });

  it("should throw if CreateTransactionRepository throws", async () => {
    const { sut, createTransactionRepository } = makeSut();
    jest.spyOn(createTransactionRepository, "execute").mockRejectedValueOnce(new Error());

    const promise = sut.execute(faker.string.uuid(), transactionParams);

    await expect(promise).rejects.toThrow();
  });
});
