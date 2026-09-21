import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import type { PasswordHasherInterface } from "../../adapters/interfaces/passwordHasherInterface.js";
import { EmailAlreadyInUseError } from "../../erros/email.js";
import type { User } from "../../entities/user.entity.js";
import type { GetUserByEmailRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-email.js";
import type { UpdateUserRepositoryInterface } from "../../repositories/interfaces/user/update-user.js";
import type { UpdateUserDTO } from "../../schemas/users/update-user.schema.js";
import { UpdateUserService } from "./update-users.js";

describe("UpdateUserService", () => {
  const user: User = {
    id: "generated_id",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: "hashed_password",
  };

  class GetUserByEmailRepositoryStub implements GetUserByEmailRepositoryInterface {
    async execute(): Promise<User | null> {
      return null;
    }
  }

  class PasswordHasherAdapterStub implements PasswordHasherInterface {
    async execute(): Promise<string> {
      return "hashed_password";
    }
  }

  class UpdateUserRepositoryStub implements UpdateUserRepositoryInterface {
    async execute(): Promise<User> {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const updateUserRepository = new UpdateUserRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const sut = new UpdateUserService(
      updateUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
    );

    return {
      sut,
      getUserByEmailRepository,
      updateUserRepository,
      passwordHasherAdapter,
    };
  };

  it("should update user successfully (without email and password)", async () => {
    const { sut } = makeSut();

    const result = await sut.execute(faker.string.uuid(), {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    });

    expect(result).toBe(user);
  });

  it("should update user successfully (with email)", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    const getUserByEmailRepositorySpy = jest.spyOn(getUserByEmailRepository, "execute");
    const email = faker.internet.email();

    const result = await sut.execute(faker.string.uuid(), { email });

    expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email);
    expect(result).toBe(user);
  });

  it("should update user successfully (with password)", async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    const passwordHasherAdapterSpy = jest.spyOn(passwordHasherAdapter, "execute");
    const password = faker.internet.password({ length: 7 });

    const result = await sut.execute(faker.string.uuid(), { password });

    expect(passwordHasherAdapterSpy).toHaveBeenCalledWith(password);
    expect(result).toBe(user);
  });

  it("should throw EmailAlreadyInUseError if email is already in use", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest.spyOn(getUserByEmailRepository, "execute").mockResolvedValue(user);

    const promise = sut.execute(faker.string.uuid(), { email: user.email });

    await expect(promise).rejects.toThrow(new EmailAlreadyInUseError(user.email));
  });

  it("should call UpdateUserRepository with correct params", async () => {
    const { sut, updateUserRepository } = makeSut();
    const updateUserRepositorySpy = jest.spyOn(updateUserRepository, "execute");
    const updateUserParams: UpdateUserDTO = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    };

    await sut.execute(user.id, updateUserParams);

    expect(updateUserRepositorySpy).toHaveBeenCalledWith(user.id, {
      ...updateUserParams,
      password: "hashed_password",
    });
  });

  it("should throw if GetUserByEmailRepository throws", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest.spyOn(getUserByEmailRepository, "execute").mockRejectedValue(new Error());

    const promise = sut.execute(faker.string.uuid(), {
      email: faker.internet.email(),
    });

    await expect(promise).rejects.toThrow();
  });

  it("should throw if PasswordHasherAdapter throws", async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    jest.spyOn(passwordHasherAdapter, "execute").mockRejectedValue(new Error());

    const promise = sut.execute(faker.string.uuid(), {
      password: faker.internet.password({ length: 7 }),
    });

    await expect(promise).rejects.toThrow();
  });

  it("should throw if UpdateUserRepository throws", async () => {
    const { sut, updateUserRepository } = makeSut();
    jest.spyOn(updateUserRepository, "execute").mockRejectedValue(new Error());

    const promise = sut.execute(faker.string.uuid(), {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    });

    await expect(promise).rejects.toThrow();
  });
});
