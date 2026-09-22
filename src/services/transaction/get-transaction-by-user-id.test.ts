import { jest } from "@jest/globals";
import type { Transaction } from "../../entities/transaction.entity.js";
import type { User } from "../../entities/user.entity.js";
import { UserNotFoundError } from "../../erros/userId.js";
import type { GetTransactionByUserIdInterface } from "../../repositories/interfaces/transaction/get-transaction-by-user-id.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import { GetTransactionByUserIdService } from "./get-transaction-by-user-id.js";
import { transaction, user } from "../../tests/index.js";

describe("GetTransactionByUserIdService", () => {
  const transactions: Transaction[] = [transaction];

  class GetTransactionsByUserIdRepositoryStub implements GetTransactionByUserIdInterface {
    async execute(): Promise<Transaction[] | null> {
      return transactions;
    }
  }

  class GetUserByIdRepositoryStub implements GetUserByIdRepositoryInterface {
    async execute(): Promise<User | null> {
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
    const result = await sut.execute(user.id);

    expect(result).toEqual(transactions);
  });

  it("should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);
    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow(new UserNotFoundError(user.id));
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const getUserByIdRepositorySpy = jest.spyOn(getUserByIdRepository, "execute");
    await sut.execute(user.id);

    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(user.id);
  });

  it("should call GetTransactionByUserIdRepository with correct params", async () => {
    const { sut, getTransactionByUserIdRepository } = makeSut();
    const getTransactionByUserIdRepositorySpy = jest.spyOn(
      getTransactionByUserIdRepository,
      "execute",
    );
    await sut.execute(user.id);

    expect(getTransactionByUserIdRepositorySpy).toHaveBeenCalledWith(user.id);
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockRejectedValueOnce(new Error());
    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });

  it("should throw if GetTransactionByUserIdRepository throws", async () => {
    const { sut, getTransactionByUserIdRepository } = makeSut();
    jest.spyOn(getTransactionByUserIdRepository, "execute").mockRejectedValueOnce(new Error());
    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });
});
