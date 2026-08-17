import type { User } from "../../entities/user.entity.js";
import type { UpdateUserDTO } from "../../schemas/users/update-user.schema.js";
import type { updateUserServiceInterface } from "../../services/interfaces/user/update-user.js";
import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { UpdateUserController } from "./update-user.js";
import { response, type Request, type Response } from "express";

describe("UpdateUserController", () => {
  class UpdateUserServiceStub implements updateUserServiceInterface {
    async execute(userId: string, updateUsers: UpdateUserDTO): Promise<User | null> {
      return {
        id: "test-id",
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      };
    }
  }

  const makeSut = () => {
    const updateUserService = new UpdateUserServiceStub();
    const sut = new UpdateUserController(updateUserService);
    return { sut, updateUserService };
  };

  const req = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    },
  } as unknown as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  it("should return 200 when updating a user successfully", async () => {
    const { sut } = makeSut();

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
