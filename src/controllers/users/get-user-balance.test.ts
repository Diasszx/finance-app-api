import { faker } from "@faker-js/faker";
import type { Balance } from "../../entities/balance.entity.js";
import { GetUserBalanceController } from "./get-user-balance.js";
import type { GetUserByIdParamsDTO } from "../../schemas/users/get-user-by-id.schema.js";
import type { Request, Response } from "express";
import { jest } from "@jest/globals";

describe("GetUserBalanceController", () => {
  class GetUserBalanceServiceStub {
    async execute(): Promise<Balance | null> {
      return {
        userId: "test-id",
        earnings: faker.number.int(),
        expenses: faker.number.int(),
        investments: faker.number.int(),
        balance: faker.number.int(),
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

  it("should return 500 if GetUserBalanceService throws", async () => {
    const { sut, getUserBalanceService } = makeSut();
    jest.spyOn(getUserBalanceService, "execute").mockRejectedValueOnce(new Error());

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
