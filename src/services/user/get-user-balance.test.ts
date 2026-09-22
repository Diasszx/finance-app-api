import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import type { User } from "../../entities/user.entity.js";
import { UserNotFoundError } from "../../erros/userId.js";
import type { Balance } from "../../entities/balance.entity.js";
import type { GetUserBalanceInterface } from "../../repositories/interfaces/user/get-user-balance.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import { GetUserBalanceService } from "./get-user-balance.js";
import { user } from "../../tests/index.js";

describe("GetUserBalanceService", () => {
  const balance: Balance = {
    userId: faker.string.uuid(),
    earnings: faker.number.float({ min: 0, max: 10000, fractionDigits: 2 }),
    expenses: faker.number.float({ min: 0, max: 10000, fractionDigits: 2 }),
    investments: faker.number.float({ min: 0, max: 10000, fractionDigits: 2 }),
    balance: faker.number.float({ min: 0, max: 10000, fractionDigits: 2 }),
  };

  class GetUserBalanceRepositoryStub implements GetUserBalanceInterface {
    async execute(): Promise<Balance> {
      return balance;
    }
  }

  class GetUserByIdRepositoryStub implements GetUserByIdRepositoryInterface {
    async execute(): Promise<User | null> {
      return user;
    }
  }

  const makeSut = () => {
    const getUserBalanceRepository = new GetUserBalanceRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();

    const sut = new GetUserBalanceService(getUserBalanceRepository, getUserByIdRepository);

    return { sut, getUserBalanceRepository, getUserByIdRepository };
  };

  it("should get user balance successfully", async () => {
    const { sut } = makeSut();
    const userId = user.id;

    const result = await sut.execute(userId);

    expect(result).toEqual(balance);
  });

  it("should throw UserNotFoundError if GetUserByIdRepository returns null", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockResolvedValue(null);
    const userId = user.id;

    const promise = sut.execute(userId);

    await expect(promise).rejects.toThrow(new UserNotFoundError(userId));
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const userId = user.id;
    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should call GetUserBalanceRepository with correct params", async () => {
    const { sut, getUserBalanceRepository } = makeSut();
    const userId = user.id;
    const executeSpy = jest.spyOn(getUserBalanceRepository, "execute");

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockRejectedValue(new Error());

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });

  it("should throw if GetUserBalanceRepository throws", async () => {
    const { sut, getUserBalanceRepository } = makeSut();
    jest.spyOn(getUserBalanceRepository, "execute").mockRejectedValue(new Error());

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });
});
