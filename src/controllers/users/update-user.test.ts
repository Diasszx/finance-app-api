import type { User } from "../../entities/user.entity.js";
import type { UpdateUserDTO } from "../../schemas/users/update-user.schema.js";
import type { updateUserServiceInterface } from "../../services/interfaces/user/update-user.js";
import { jest } from "@jest/globals";
import { UpdateUserController } from "./update-user.js";
import { response, type Request, type Response } from "express";
import { EmailAlreadyInUseError } from "../../erros/email.js";
import { user } from "../../tests/index.js";

describe("UpdateUserController", () => {
  class UpdateUserServiceStub implements updateUserServiceInterface {
    async execute(userId: string, updateUsers: UpdateUserDTO): Promise<User | null> {
      return {
        ...user,
        id: userId,
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
      userId: user.id,
    },
    body: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
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

  it("should return 400 if email is not valid", async () => {
    const { sut } = makeSut();

    await sut.execute({ ...req.body, email: "invalid_email" }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if password is less than 7 characters", async () => {
    const { sut } = makeSut();

    await sut.execute({ ...req.body, password: "1234" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  //   it("should return 400 when id is invalid", async () => {
  //       const { sut } = makeSut();
  //       await sut.execute(
  //         {
  //           params: {
  //             userId: "invalid_id",
  //           },
  //         } as Request<GetUserByIdParamsDTO>,
  //         res,
  //       );
  //       expect(res.status).toHaveBeenCalledWith(400);
  //     });

  it("should return 400 when a unallowed field is provided", async () => {
    const { sut } = makeSut();
    await sut.execute({ ...req.body, unallowedField: "unallowedValue" }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 500 if UpdateUserController throws", async () => {
    const { sut, updateUserService } = makeSut();
    jest.spyOn(updateUserService, "execute").mockRejectedValueOnce(new Error());
    await sut.execute(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 400 if CreateUserService throws EmailAlreadyInUse error", async () => {
    const { sut, updateUserService } = makeSut();

    jest
      .spyOn(updateUserService, "execute")
      .mockRejectedValueOnce(new EmailAlreadyInUseError(req.body.email));

    await sut.execute(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
