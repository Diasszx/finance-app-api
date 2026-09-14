import { CreateUserService } from "./create-user.js";
import { faker } from "@faker-js/faker";

describe("Create User Service", () => {
  const user = {
    id: "generated_id",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: "hashed_password",
  };

  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class CreateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordHasherAdapterStub {
    async execute() {
      return "hashed_password";
    }
  }

  class IdGeneratorAdapterStub {
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
});
