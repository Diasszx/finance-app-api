import { faker } from "@faker-js/faker";
import type { Balance } from "../../entities/balance.entity.js";
import { GetUserBalanceController } from "./get-user-balance.js";
import type { GetUserByIdParamsDTO } from "../../schemas/users/get-user-by-id.schema.js";
import type { Request, Response } from "express";

describe("GetUserBalanceController", () => {
  class GetUserBalanceServiceStub {
    async execute(): Promise<Balance | null> {
      return {
        userId: "test-id",
        earnings: faker.number.float(),
        expenses: faker.number.float(),
        investments: faker.number.float(),
        balance: faker.number.float(),
      };
    }
  }

  const makeSut = () => {
    const getUserBalanceService = new GetUserBalanceServiceStub();
    const sut = new GetUserBalanceController(getUserBalanceService);
    return { getUserBalanceService, sut };
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

  it("should return 200 when find a user successfully", async () => {
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
    const { sut, getUserBalanceService } = makeSut();
    jest.spyOn(getUserBalanceService, "execute").mockImplementationOnce(async () => null);

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 500 if GetUserBalanceService throws", async () => {
    const { sut, getUserBalanceService } = makeSut();
    jest.spyOn(getUserBalanceService, "execute").mockImplementationOnce(async () => {
      throw new Error();
    });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
