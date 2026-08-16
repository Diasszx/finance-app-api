import type { Request, Response } from "express";
import { CreateUserController } from "./create-user.js";
import type { CreateUserDTO } from "../../schemas/users/create-user.schema.js";
import type { User } from "../../generated/prisma/client.js";
import type { CreateUserServiceInterface } from "../../services/interfaces/user/create-user.js";
import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { EmailAlreadyInUseError } from "../../erros/email.js";

describe("Create User Controller", () => {
  class CreateUserServiceStub implements CreateUserServiceInterface {
    async execute(user: CreateUserDTO): Promise<User> {
      return {
        id: "test-id",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      };
    }
  }

  const makeSut = () => {
    const createUserService = new CreateUserServiceStub();
    const sut = new CreateUserController(createUserService);

    return { createUserService, sut };
  };

  const req = {
    body: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    },
  } as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  it("should return 201 when creating a user successfully", async () => {
    const { sut } = makeSut();

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: "test-id",
      ...req.body,
    });
  });

  it("should return 400 if firstName is not provided", async () => {
    const { sut } = makeSut();

    await sut.execute({ ...req.body, firstName: undefined }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if lastName is not provided", async () => {
    const { sut } = makeSut();

    await sut.execute({ ...req.body, lastName: undefined }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if email is not provided", async () => {
    const { sut } = makeSut();

    await sut.execute({ ...req.body, email: undefined }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if email is not valid", async () => {
    const { sut } = makeSut();

    await sut.execute({ ...req.body, email: "invalid_email" }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if password is not provided", async () => {
    const { sut } = makeSut();

    await sut.execute({ ...req.body, password: undefined }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if password is less than 6 characters", async () => {
    const { sut } = makeSut();

    await sut.execute({ ...req.body, password: faker.internet.password({ length: 4 }) }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should call CreateUserService with correct params", async () => {
    const { sut, createUserService } = makeSut();

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const executeSpy = jest.spyOn(createUserService, "execute");
    await sut.execute(req, res);

    expect(executeSpy).toHaveBeenCalledWith(req.body);
  });

  it("should return 500 if CreateUserService throw", async () => {
    const { sut, createUserService } = makeSut();

    jest.spyOn(createUserService, "execute").mockImplementationOnce(() => {
      throw new Error();
    });

    await sut.execute(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 400 if CreateUserService throws EmailAlreadyInUse error", async () => {
    const { sut, createUserService } = makeSut();

    jest.spyOn(createUserService, "execute").mockImplementationOnce(() => {
      throw new EmailAlreadyInUseError(req.body.email);
    });

    await sut.execute(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
