import { jest } from "@jest/globals";
import type { IdGeneratorInterface } from "../../adapters/interfaces/id-generatorInterface.js";
import type { User } from "../../entities/user.entity.js";
import type { Transaction } from "../../entities/transaction.entity.js";
import { UserNotFoundError } from "../../erros/userId.js";
import type { CreateTransactionRepositoryInterface } from "../../repositories/interfaces/transaction/create-transaction.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import { CreateTransactionService } from "./create-transaction.js";
import { transaction, user } from "../../tests/index.js";

describe("CreateTransactionService", () => {
  const transactionParams = {
    ...transaction,
    id: undefined,
  };

  const createdTransaction: Transaction = {
    ...transaction,
    userId: user.id,
  };

  class CreateTransactionRepositoryStub implements CreateTransactionRepositoryInterface {
    async execute(): Promise<Transaction> {
      return createdTransaction;
    }
  }

  class IdGeneratorAdapterStub implements IdGeneratorInterface {
    execute(): string {
      return transaction.id;
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

    const result = await sut.execute(user.id, transactionParams);

    expect(result).toEqual(createdTransaction);
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const getUserByIdRepositorySpy = jest.spyOn(getUserByIdRepository, "execute");

    await sut.execute(user.id, transactionParams);

    expect(getUserByIdRepositorySpy).toHaveBeenCalledWith(user.id);
  });

  it("should call IdGeneratorAdapter", async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    const idGeneratorAdapterSpy = jest.spyOn(idGeneratorAdapter, "execute");

    await sut.execute(user.id, transactionParams);

    expect(idGeneratorAdapterSpy).toHaveBeenCalled();
  });

  it("should call CreateTransactionRepository with correct params", async () => {
    const { sut, createTransactionRepository } = makeSut();
    const createTransactionRepositorySpy = jest.spyOn(createTransactionRepository, "execute");

    await sut.execute(user.id, transactionParams);

    expect(createTransactionRepositorySpy).toHaveBeenCalledWith({
      ...transactionParams,
      id: transaction.id,
      userId: user.id,
    });
  });

  it("should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValueOnce(null);

    const promise = sut.execute(user.id, transactionParams);

    await expect(promise).rejects.toThrow(new UserNotFoundError(user.id));
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.id, transactionParams);

    await expect(promise).rejects.toThrow();
  });

  it("should throw if IdGeneratorAdapter throws", async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    jest.spyOn(idGeneratorAdapter, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.execute(user.id, transactionParams);

    await expect(promise).rejects.toThrow();
  });

  it("should throw if CreateTransactionRepository throws", async () => {
    const { sut, createTransactionRepository } = makeSut();
    jest.spyOn(createTransactionRepository, "execute").mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.id, transactionParams);

    await expect(promise).rejects.toThrow();
  });
});
