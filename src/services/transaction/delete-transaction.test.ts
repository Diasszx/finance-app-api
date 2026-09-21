import { jest } from "@jest/globals";
import type { DeleteTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/delete-transaction.js";
import { DeleteTransactionService } from "./delete-transaction.js";
import { transaction } from "../../tests/index.js";

describe("DeleteTransactionService", () => {
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
    const result = await sut.execute(transaction.id);

    expect(result).toEqual(transaction);
  });

  it("should call DeleteTransactionRepository with correct params", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    const deleteTransactionRepositorySpy = jest.spyOn(deleteTransactionRepository, "execute");
    const transactionId = transaction.id;

    await sut.execute(transactionId);

    expect(deleteTransactionRepositorySpy).toHaveBeenCalledWith(transactionId);
  });

  it("should throw if DeleteTransactionRepository throws", async () => {
    const { sut, deleteTransactionRepository } = makeSut();
    jest.spyOn(deleteTransactionRepository, "execute").mockRejectedValueOnce(new Error());
    const transactionId = transaction.id;

    const promise = sut.execute(transactionId);

    await expect(promise).rejects.toThrow();
  });
});
