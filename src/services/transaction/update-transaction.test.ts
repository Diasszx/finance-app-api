import { jest } from "@jest/globals";
import type { UpdateTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/update-transaction.js";
import type { UpdateTransactionDTO } from "../../schemas/transaction/update-transaction.schema.js";
import { UpdateTransactionService } from "./update-transaction.js";
import { transaction } from "../../tests/index.js";

describe("UpdateTransactionService", () => {
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
      amount: transaction.amount,
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
