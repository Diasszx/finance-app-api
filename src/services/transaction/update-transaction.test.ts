import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import type { Transaction } from "../../entities/transaction.entity.js";
import type { UpdateTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/update-transaction.js";
import type { UpdateTransactionDTO } from "../../schemas/transaction/update-transaction.schema.js";
import { TransactionType } from "../../generated/prisma/enums.js";
import { UpdateTransactionService } from "./update-transaction.js";

describe("UpdateTransactionService", () => {
  const transaction: Transaction = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    title: faker.string.alpha({ length: 10 }),
    date: faker.date.future().toISOString().slice(0, 10),
    amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
    type: faker.helpers.arrayElement(Object.values(TransactionType)),
  };

  class UpdateTransactionRepositoryStub implements UpdateTransactionRepositoryInterface {
    async execute(): Promise<Transaction> {
      return transaction;
    }
  }

  const makeSut = () => {
    const updateTransactionRepository = new UpdateTransactionRepositoryStub();
    const sut = new UpdateTransactionService(updateTransactionRepository);

    return {
      sut,
      updateTransactionRepository,
    };
  };

  it("should update a transaction successfully", async () => {
    const { sut } = makeSut();
    const updateTransaction: UpdateTransactionDTO = {
      amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
    };

    const result = await sut.execute(transaction.id, updateTransaction);

    expect(result).toEqual(transaction);
  });

  it("should call UpdateTransactionRepository with correct params", async () => {
    const { sut, updateTransactionRepository } = makeSut();
    const updateTransactionRepositorySpy = jest.spyOn(updateTransactionRepository, "execute");
    const updateTransaction: UpdateTransactionDTO = {
      amount: transaction.amount,
    };

    await sut.execute(transaction.id, updateTransaction);

    expect(updateTransactionRepositorySpy).toHaveBeenCalledWith(transaction.id, updateTransaction);
  });

  it("should throw if UpdateTransactionRepository throws", async () => {
    const { sut, updateTransactionRepository } = makeSut();
    jest.spyOn(updateTransactionRepository, "execute").mockRejectedValueOnce(new Error());

    const promise = sut.execute(transaction.id, {
      amount: transaction.amount,
    });

    await expect(promise).rejects.toThrow();
  });
});
