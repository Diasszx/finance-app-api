import type { Request, Response } from "express";
import { CreateUserController } from "./create-user.js";
import type { CreateUserDTO } from "../../schemas/users/create-user.schema.js";
import type { User } from "../../generated/prisma/client.js";
import type { CreateUserServiceInterface } from "../../services/interfaces/user/create-user.js";
import { jest } from "@jest/globals";

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

  it("should return 201 when creating a user successfully", async () => {
    const createUserService = new CreateUserServiceStub();

    const createUserController = new CreateUserController(createUserService);

    const req = {
      body: {
        firstName: "Test",
        lastName: "Test",
        email: "testtest@gmail.com",
        password: "test123456",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await createUserController.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: "test-id",
      firstName: "Test",
      lastName: "Test",
      email: "testtest@gmail.com",
      password: "test123456",
    });
  });
  it("should return 400 if firstName is not provided", async () => {
    const createUserService = new CreateUserServiceStub();
    const createUserController = new CreateUserController(createUserService);

    const req = {
      body: {
        firstName: "",
        lastName: "test",
        email: "test@gmail.com",
        password: "testetest1234",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await createUserController.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("should return 400 if lastName is not provided", async () => {
    const createUserService = new CreateUserServiceStub();
    const createUserController = new CreateUserController(createUserService);

    const req = {
      body: {
        firstName: "teste",
        lastName: "",
        email: "test@gmail.com",
        password: "testetest1234",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await createUserController.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("should return 400 if email is not provided", async () => {
    const createUserService = new CreateUserServiceStub();
    const createUserController = new CreateUserController(createUserService);

    const req = {
      body: {
        firstName: "teste",
        lastName: "test",
        email: "",
        password: "testetest1234",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await createUserController.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("should return 400 if email is not valid", async () => {
    const createUserService = new CreateUserServiceStub();
    const createUserController = new CreateUserController(createUserService);

    const req = {
      body: {
        firstName: "teste",
        lastName: "test",
        email: "te",
        password: "testetest1234",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await createUserController.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
