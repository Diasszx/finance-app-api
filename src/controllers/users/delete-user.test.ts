import type { User } from "../../entities/user.entity.js";
import type { Request, Response } from "express";
import { DeleteUserController } from "./delete-user.js";
import type { GetUserByIdParamsDTO } from "../../schemas/users/get-user-by-id.schema.js";
import { jest } from "@jest/globals";
import type { DeleteUserServiceInterface } from "../../services/interfaces/user/delete-user.js";
import { user } from "../../tests/index.js";

describe("DeleteUserController", () => {
  class DeleteUserServiceStub implements DeleteUserServiceInterface {
    async execute(): Promise<User | null> {
      return user;
    }
  }

  const makeSut = () => {
    const deleteUserService = new DeleteUserServiceStub();
    const sut = new DeleteUserController(deleteUserService);
    return { deleteUserService, sut };
  };

  const req = {
    params: {
      userId: user.id,
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

  it("should return 404 if user is not found", async () => {
    const { sut, deleteUserService } = makeSut();
    jest.spyOn(deleteUserService, "execute").mockResolvedValue(null);

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 500 if DeleteUserService throws", async () => {
    const { sut, deleteUserService } = makeSut();
    jest.spyOn(deleteUserService, "execute").mockRejectedValueOnce(new Error());

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
