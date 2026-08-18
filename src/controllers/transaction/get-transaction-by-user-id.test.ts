import { faker } from "@faker-js/faker";
import type { Transaction } from "../../entities/transaction.entity.js";
import type { GetTransactionByIdServiceInterface } from "../../services/interfaces/transaction/get-transaction-by-user-id.js";
import { GetTransactionsByUserIdController } from "./get-transaction-by-user-id.js";
import type { Response } from "express";
import { jest } from "@jest/globals";
import type { GetTransactionByIdQueryDTO } from "../../schemas/transaction/get-transaction-by-id.schema.js";
import type { TypedRequestQuery } from "../utils/http.js";
import { UserNotFoundError } from "../../erros/userId.js";
import { TransactionType } from "../../generated/prisma/enums.js";

describe("GetTransactionsByUserIdController", () => {
  class GetTransactionsByUserIdServiceStub implements GetTransactionByIdServiceInterface {
    async execute(): Promise<Transaction[] | null> {
      return [
        {
          id: faker.string.uuid(),
          userId: faker.string.uuid(),
          title: faker.string.alpha({ length: 10 }),
          date: faker.date.future().toISOString().slice(0, 10),
          amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
          type: faker.helpers.arrayElement(Object.values(TransactionType)),
        },
      ];
    }
  }

  const makeSut = () => {
    const getTransactionsByUserIdService = new GetTransactionsByUserIdServiceStub();
    const sut = new GetTransactionsByUserIdController(getTransactionsByUserIdService);
    return { sut, getTransactionsByUserIdService };
  };

  const makeRes = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }) as unknown as Response;

  const req = {
    query: {
      userId: faker.string.uuid(),
    },
  } as unknown as TypedRequestQuery<GetTransactionByIdQueryDTO>;

  it("should return 200 when finding transactions successfully", async () => {
    const { sut } = makeSut();
    const res = makeRes();

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 400 when userId is invalid", async () => {
    const { sut } = makeSut();
    const res = makeRes();
    const invalidReq = {
      query: {
        userId: "invalid-uuid",
      },
    } as unknown as TypedRequestQuery<GetTransactionByIdQueryDTO>;

    await sut.execute(invalidReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 404 if user is not found", async () => {
    const { sut, getTransactionsByUserIdService } = makeSut();
    const res = makeRes();
    jest
      .spyOn(getTransactionsByUserIdService, "execute")
      .mockRejectedValueOnce(new UserNotFoundError(req.query.userId));

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should call GetTransactionsByUserIdService with correct params", async () => {
    const { sut, getTransactionsByUserIdService } = makeSut();
    const res = makeRes();

    const executeSpy = jest.spyOn(getTransactionsByUserIdService, "execute");
    await sut.execute(req, res);

    expect(executeSpy).toHaveBeenCalledWith(req.query.userId);
  });

  it("should return transactions array in response", async () => {
    const { sut, getTransactionsByUserIdService } = makeSut();
    const res = makeRes();
    const mockTransactions = [
      {
        id: faker.string.uuid(),
        userId: req.query.userId,
        title: faker.string.alpha({ length: 10 }),
        date: faker.date.future().toISOString().slice(0, 10),
        amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
        type: TransactionType.EARNING,
      },
    ];
    jest.spyOn(getTransactionsByUserIdService, "execute").mockResolvedValueOnce(mockTransactions);

    await sut.execute(req, res);

    expect(res.json).toHaveBeenCalledWith(mockTransactions);
  });

  it("should return 500 if GetTransactionsByUserIdService throws", async () => {
    const { sut, getTransactionsByUserIdService } = makeSut();
    const res = makeRes();
    jest.spyOn(getTransactionsByUserIdService, "execute").mockRejectedValueOnce(new Error());

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
