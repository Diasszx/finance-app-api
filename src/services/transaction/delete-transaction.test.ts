import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import { DeleteTransactionService } from "./delete-transaction.js";
import type { DeleteTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/delete-transaction.js";
import type { Transaction } from "../../entities/transaction.entity.js";
import { TransactionType } from "../../generated/prisma/enums.js";

describe("DeleteTransactionService", () => {
  class DeleteTransactionRepositoryStub implements DeleteTransactionRepositoryInterface {
    async execute(transactionId: string): Promise<Transaction | null> {
      return {
        id: transactionId,
        userId: faker.string.uuid(),
        title: faker.string.alpha({ length: 10 }),
        date: faker.date.future().toISOString().slice(0, 10),
        amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
        type: faker.helpers.arrayElement(Object.values(TransactionType)),
      };
    }
  }

  const makeSut = () => {
    const deleteTransactionRepository = new DeleteTransactionRepositoryStub();
    const sut = new DeleteTransactionService(deleteTransactionRepository);
    return { sut, deleteTransactionRepository };
  };

  it("should delete a transaction successfully", async () => {
    const { sut } = makeSut();
    const transactionId = faker.string.uuid();

    const result = await sut.execute(transactionId);

    expect(result).toHaveProperty("id", transactionId);
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("amount");
    expect(result).toHaveProperty("type");
  });

  it("should call DeleteTransactionRepository with correct transactionId", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    const transactionId = faker.string.uuid();
    const executeSpy = jest.spyOn(deleteTransactionRepository, "execute");

    await sut.execute(transactionId);

    expect(executeSpy).toHaveBeenCalledWith(transactionId);
  });

  it("should return null if transaction does not exist", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    const transactionId = faker.string.uuid();
    jest.spyOn(deleteTransactionRepository, "execute").mockResolvedValueOnce(null);

    const result = await sut.execute(transactionId);

    expect(result).toBeNull();
  });

  it("should return deleted transaction data", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    const transactionId = faker.string.uuid();
    const mockTransaction: Transaction = {
      id: transactionId,
      userId: faker.string.uuid(),
      title: "Deleted Transaction",
      date: "2024-01-01",
      amount: 100.5,
      type: TransactionType.EXPENSE,
    };
    jest.spyOn(deleteTransactionRepository, "execute").mockResolvedValueOnce(mockTransaction);

    const result = await sut.execute(transactionId);

    expect(result).toEqual(mockTransaction);
    expect(result?.title).toBe("Deleted Transaction");
    expect(result?.amount).toBe(100.5);
    expect(result?.type).toBe(TransactionType.EXPENSE);
  });
});
