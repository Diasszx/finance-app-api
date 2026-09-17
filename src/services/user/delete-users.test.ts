import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import type { User } from "../../entities/user.entity.js";
import type { DeleteUserRepositoryInterface } from "../../repositories/interfaces/user/delete-user.js";
import { DeleteUserService } from "./delete-user.js";

describe("Delete User Service", () => {
  const user = {
    id: "generated_id",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: "hashed_password",
  };

  class deleteUserRepositoryStub implements DeleteUserRepositoryInterface {
    async execute(): Promise<User | null> {
      return user;
    }
  }

  const makeSut = () => {
    const deleteUserRepository = new deleteUserRepositoryStub();
    const sut = new DeleteUserService(deleteUserRepository);

    return {
      sut,
      deleteUserRepository,
    };
  };
  it("should successfully delete a user", async () => {
    const { sut } = makeSut();

    const deletedUser = await sut.execute(faker.string.uuid());

    expect(deletedUser).toEqual(user);
  });

  it("should call deleteUserRepository with correct params", async () => {
    const { sut, deleteUserRepository } = makeSut();
    const executeSpy = jest.spyOn(deleteUserRepository, "execute");
    const userId = faker.string.uuid();

    await sut.execute(userId);

    expect(executeSpy).toHaveBeenCalledWith(userId);
  });

  it("should throw if DeleteUserRepository throws", async () => {
    const { sut, deleteUserRepository } = makeSut();
    jest.spyOn(deleteUserRepository, "execute").mockRejectedValueOnce(new Error());
    const userId = faker.string.uuid();

    const promise = sut.execute(userId);

    await expect(promise).rejects.toThrow();
  });
});
