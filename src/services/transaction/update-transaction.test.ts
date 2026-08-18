import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import { UpdateTransactionService } from "./update-transaction.js";
import type { UpdateTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/update-transaction.js";
import type { Transaction } from "../../entities/transaction.entity.js";
import { TransactionType } from "../../generated/prisma/enums.js";

describe("UpdateTransactionService", () => {
  class UpdateTransactionRepositoryStub implements UpdateTransactionRepositoryInterface {
    async execute(transactionId: string, updateData: unknown): Promise<Transaction | null> {
      return {
        id: transactionId,
        userId: faker.string.uuid(),
        title: (updateData as { title?: string }).title || faker.string.alpha({ length: 10 }),
        date:
          (updateData as { date?: string }).date || faker.date.future().toISOString().slice(0, 10),
        amount:
          (updateData as { amount?: number }).amount ||
          faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
        type:
          (updateData as { type?: TransactionType }).type ||
          faker.helpers.arrayElement(Object.values(TransactionType)),
      };
    }
  }

  const makeSut = () => {
    const updateTransactionRepository = new UpdateTransactionRepositoryStub();
    const sut = new UpdateTransactionService(updateTransactionRepository);
    return { sut, updateTransactionRepository };
  };

  const createUpdateData = (overrides = {}) => ({
    title: faker.string.alpha({ length: 10 }),
    date: faker.date.future().toISOString().slice(0, 10),
    amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
    type: faker.helpers.arrayElement(Object.values(TransactionType)),
    ...overrides,
  });

  it("should update a transaction successfully", async () => {
    const { sut } = makeSut();
    const transactionId = faker.string.uuid();
    const updateData = createUpdateData();

    const result = await sut.execute(transactionId, updateData);

    expect(result).toHaveProperty("id", transactionId);
    expect(result?.title).toBe(updateData.title);
    expect(result?.date).toBe(updateData.date);
    expect(result?.amount).toBe(updateData.amount);
    expect(result?.type).toBe(updateData.type);
  });

  it("should call UpdateTransactionRepository with correct params", async () => {
    const { sut, updateTransactionRepository } = makeSut();
    const transactionId = faker.string.uuid();
    const updateData = createUpdateData();
    const executeSpy = jest.spyOn(updateTransactionRepository, "execute");

    await sut.execute(transactionId, updateData);

    expect(executeSpy).toHaveBeenCalledWith(transactionId, updateData);
  });

  it("should return null if transaction does not exist", async () => {
    const { sut, updateTransactionRepository } = makeSut();
    const transactionId = faker.string.uuid();
    jest.spyOn(updateTransactionRepository, "execute").mockResolvedValueOnce(null);

    const result = await sut.execute(transactionId, createUpdateData());

    expect(result).toBeNull();
  });

  it("should update transaction with partial data", async () => {
    const { sut } = makeSut();
    const transactionId = faker.string.uuid();
    const partialUpdate = { title: faker.string.alpha({ length: 15 }) };

    const result = await sut.execute(transactionId, partialUpdate);

    expect(result?.title).toBe(partialUpdate.title);
    expect(result).toHaveProperty("id", transactionId);
  });
});
