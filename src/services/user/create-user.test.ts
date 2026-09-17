import { jest } from "@jest/globals";
import { CreateUserService } from "./create-user.js";
import { faker } from "@faker-js/faker";
import type { GetUserByEmailRepositoryInterface } from "../../repositories/interfaces/user/get-user-by-email.js";
import type { CreateUserRepositoryInterface } from "../../repositories/interfaces/user/create-user.js";
import type { PasswordHasherInterface } from "../../adapters/interfaces/passwordHasherInterface.js";
import type { IdGeneratorInterface } from "../../adapters/interfaces/id-generatorInterface.js";
import { EmailAlreadyInUseError } from "../../erros/email.js";
import type { User } from "../../entities/user.entity.js";

describe("Create User Service", () => {
  const user = {
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

  class CreateUserRepositoryStub implements CreateUserRepositoryInterface {
    async execute() {
      return user;
    }
  }

  class PasswordHasherAdapterStub implements PasswordHasherInterface {
    async execute() {
      return "hashed_password";
    }
  }

  class IdGeneratorAdapterStub implements IdGeneratorInterface {
    execute() {
      return "generated_id";
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const createUserRepository = new CreateUserRepositoryStub();
    const passwordHasherAdapter = new PasswordHasherAdapterStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();
    const sut = new CreateUserService(
      createUserRepository,
      getUserByEmailRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
    );

    return {
      sut,
      getUserByEmailRepository,
      createUserRepository,
      passwordHasherAdapter,
      idGeneratorAdapter,
    };
  };

  it("should successfully create a user", async () => {
    const { sut } = makeSut();

    const createdUser = await sut.execute({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    });

    expect(createdUser).toBeTruthy();
  });

  it("should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest.spyOn(getUserByEmailRepository, "execute").mockResolvedValueOnce(user);

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow(new EmailAlreadyInUseError(user.email));
  });

  it("should call IdGeneratorAdapter  to generate a random id", async () => {
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut();
    const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, "execute");
    const createUserRepositorySpy = jest.spyOn(createUserRepository, "execute");

    await sut.execute(user);

    expect(idGeneratorSpy).toHaveBeenCalled();
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: "hashed_password",
      id: "generated_id",
    });
  });

  it("should call PasswordHasherAdapter to generate a random id", async () => {
    const { sut, createUserRepository, passwordHasherAdapter } = makeSut();
    const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, "execute");
    const createUserRepositorySpy = jest.spyOn(createUserRepository, "execute");

    await sut.execute(user);

    expect(passwordHasherSpy).toHaveBeenCalled();
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: "hashed_password",
      id: "generated_id",
    });
  });

  it("should throw if GetUserByEmailRepository throws", async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    jest.spyOn(getUserByEmailRepository, "execute").mockRejectedValueOnce(new Error());

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });

  it("should throw if IdGeneratorAdapter throws", async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    jest.spyOn(idGeneratorAdapter, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });

  it("should throw if passwordHasherAdapter throws", async () => {
    const { sut, passwordHasherAdapter } = makeSut();
    jest.spyOn(passwordHasherAdapter, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });

  it("should throw if passwordHasherAdapter throws", async () => {
    const { sut, createUserRepository } = makeSut();
    jest.spyOn(createUserRepository, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });
});
