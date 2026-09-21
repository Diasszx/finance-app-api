import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import type { Transaction } from "../../entities/transaction.entity.js";
import type { DeleteTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/delete-transaction.js";
import { TransactionType } from "../../generated/prisma/enums.js";
import { DeleteTransactionService } from "./delete-transaction.js";

describe("DeleteTransactionService", () => {
  const transaction: Transaction = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    title: faker.string.alpha({ length: 10 }),
    date: faker.date.future().toISOString().slice(0, 10),
    amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
    type: faker.helpers.arrayElement(Object.values(TransactionType)),
  };

  class DeleteTransactionRepositoryStub implements DeleteTransactionRepositoryInterface {
    async execute(): Promise<Transaction | null> {
      return transaction;
    }
  }

  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const sut = new DeleteTransactionService(deleteTransactionRepository);

    return {
      sut,
      deleteTransactionRepository,
    };
  };

  it("should delete transaction successfully", async () => {
    const { sut } = makeSut();
    const transactionId = faker.string.uuid();

    const result = await sut.execute(transactionId);

    expect(result).toEqual(transaction);
  });

  it("should call DeleteTransactionRepository with correct params", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    const deleteTransactionRepositorySpy = jest.spyOn(deleteTransactionRepository, "execute");
    const transactionId = faker.string.uuid();

    await sut.execute(transactionId);

    expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(transactionId);
  });

  it("should throw if DeleteTransactionRepository throws", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    jest.spyOn(deleteTransactionRepository, "execute").mockRejectedValueOnce(new Error());
    const transactionId = faker.string.uuid();

    const promise = sut.execute(transactionId);

    await expect(promise).rejects.toThrow();
  });
});
