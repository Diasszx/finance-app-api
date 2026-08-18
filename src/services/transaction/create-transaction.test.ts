import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import { CreateTransactionService } from "./create-transaction.js";
import type { CreateTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/create-transaction.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import type { Transaction } from "../../entities/transaction.entity.js";
import type { User } from "../../entities/user.entity.js";
import { TransactionType } from "../../generated/prisma/enums.js";
import { UserNotFoundError } from "../../erros/userId.js";

describe("CreateTransactionService", () => {
  class CreateTransactionRepositoryStub implements CreateTransactionRepositoryInterface {
    async execute(transaction: Transaction): Promise<Transaction> {
      return transaction;
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
    const createTransactionRepository = new CreateTransactionRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new CreateTransactionService(createTransactionRepository, getUserByIdRepository);
    return { sut, createTransactionRepository, getUserByIdRepository };
  };

  const createTransactionData = () => ({
    title: faker.string.alpha({ length: 10 }),
    date: faker.date.future().toISOString().slice(0, 10),
    amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
    type: faker.helpers.arrayElement(Object.values(TransactionType)),
  });

  it("should create a transaction successfully", async () => {
    const { sut } = makeSut();
    const userId = faker.string.uuid();
    const transactionData = createTransactionData();

    const result = await sut.execute(userId, transactionData);

    expect(result).toHaveProperty("id");
    expect(result.userId).toBe(userId);
    expect(result.title).toBe(transactionData.title);
    expect(result.date).toBe(transactionData.date);
    expect(result.amount).toBe(transactionData.amount);
    expect(result.type).toBe(transactionData.type);
  });

  it("should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);

    const promise = sut.execute(userId, createTransactionData());

    await expect(promise).rejects.toThrow(UserNotFoundError);
  });

  it("should call GetUserByIdRepository with correct userId", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const userId = faker.string.uuid();
    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");

    await sut.execute(userId, createTransactionData());

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should call CreateTransactionRepository with correct params", async () => {
    const { sut, createTransactionRepository } = makeSut();
    const userId = faker.string.uuid();
    const transactionData = createTransactionData();
    const executeSpy = jest.spyOn(createTransactionRepository, "execute");

    await sut.execute(userId, transactionData);

    expect(executeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        userId,
        title: transactionData.title,
        date: transactionData.date,
        amount: transactionData.amount,
        type: transactionData.type,
      }),
    );
  });

  it("should generate a unique id for the transaction", async () => {
    const { sut } = makeSut();
    const userId = faker.string.uuid();
    const transactionData = createTransactionData();

    const result1 = await sut.execute(userId, transactionData);
    const result2 = await sut.execute(userId, transactionData);

    expect(result1.id).not.toBe(result2.id);
  });
});
