import { faker } from "@faker-js/faker";
import type { User } from "../../entities/user.entity.js";
import type { Request, Response } from "express";
import { DeleteUserController } from "./delete-user.js";
import type { GetUserByIdParamsDTO } from "../../schemas/users/get-user-by-id.schema.js";
import { jest } from "@jest/globals";

describe("DeleteUserController", () => {
  class DeleteUserServiceStub {
    async execute(): Promise<User | null> {
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
    const deleteUserService = new DeleteUserServiceStub();
    const sut = new DeleteUserController(deleteUserService);
    return { deleteUserService, sut };
  };

  const req = {
    params: {
      userId: faker.string.uuid(),
    },
  } as unknown as Request<GetUserByIdParamsDTO>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  it("should return 200 when deleting a user successfully", async () => {
    const { sut } = makeSut();

    await sut.execute(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 400 when if is invalid", async () => {
    const { sut } = makeSut();
    await sut.execute(
      {
        params: {
          userId: "invalid_id",
        },
      } as Request<GetUserByIdParamsDTO>,
      res,
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
