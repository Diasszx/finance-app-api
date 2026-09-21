import { jest } from "@jest/globals";
import type { User } from "../../entities/user.entity.js";
import type { GetUserByIdRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-id.js";
import { GetUserByIdService } from "./get-user-by-id.js";
import { user } from "../../tests/index.js";

describe("GetUserByIdService", () => {
  class GetUserByIdRepositoryStub implements GetUserByIdRepositoryInterface {
    async execute(): Promise<User | null> {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdService(getUserByIdRepository);

    return {
      sut,
      getUserByIdRepository,
    };
  };

  it("should get user by id successfully", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user.id);

    expect(result).toEqual(user);
  });

  it("should call GetUserByIdRepository with correct params", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    const executeSpy = jest.spyOn(getUserByIdRepository, "execute");
    const userId = user.id;

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should throw if GetUserByIdRepository throws", async () => {
    const { sut, getUserByIdRepository } = makeSut();
    jest.spyOn(getUserByIdRepository, "execute").mockRejectedValue(new Error());

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });
});
