import { faker } from "@faker-js/faker";
import type { Transaction } from "../../entities/transaction.entity.js";
import type { UpdateTransactionDTO } from "../../schemas/transaction/update-transaction.schema.js";
import type { UpdateTransactionServiceInterface } from "../../services/interfaces/transaction/update-transaction.js";
import { TransactionType } from "../../generated/prisma/enums.js";
import { UpdateTransactionController } from "./update-transaction.js";
import type { Request, Response } from "express";
import { jest } from "@jest/globals";

describe("UpdateTransactionController", () => {
  class UpdateTransactionServiceStub implements UpdateTransactionServiceInterface {
    async execute(
      transactionId: string,
      updateTransaction: UpdateTransactionDTO,
    ): Promise<Transaction | null> {
      return {
        id: transactionId,
        userId: faker.string.uuid(),
        title: updateTransaction.title || faker.string.alpha({ length: 10 }),
        date: updateTransaction.date || faker.date.future().toISOString().slice(0, 10),
        amount:
          updateTransaction.amount ||
          faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
        type: updateTransaction.type || faker.helpers.arrayElement(Object.values(TransactionType)),
      };
    }
  }

  const makeSut = () => {
    const updateTransactionService = new UpdateTransactionServiceStub();
    const sut = new UpdateTransactionController(updateTransactionService);
    return { sut, updateTransactionService };
  };

  const createReq = (overrides = {}) =>
    ({
      params: {
        transactionId: faker.string.uuid(),
      },
      body: {
        title: faker.string.alpha({ length: 10 }),
        date: faker.date.future().toISOString().slice(0, 10),
        amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
        type: faker.helpers.arrayElement(Object.values(TransactionType)),
        ...overrides,
      },
    }) as unknown as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  it("should return 200 when updating a transaction successfully", async () => {
    const { sut } = makeSut();
    const req = createReq();

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 400 when transactionId is invalid", async () => {
    const { sut } = makeSut();
    const req = createReq();
    req.params.transactionId = "invalid-uuid";

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when title has less than 2 characters", async () => {
    const { sut } = makeSut();
    const req = createReq({ title: "a" });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when date is invalid", async () => {
    const { sut } = makeSut();
    const req = createReq({ date: "invalid-date" });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when amount is less than 0.01", async () => {
    const { sut } = makeSut();
    const req = createReq({ amount: 0 });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when amount has more than 2 decimal places", async () => {
    const { sut } = makeSut();
    const req = createReq({ amount: 10.999 });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when type is invalid", async () => {
    const { sut } = makeSut();
    const req = createReq({ type: "INVALID_TYPE" });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when a unallowed field is provided", async () => {
    const { sut } = makeSut();
    const req = createReq();
    req.body.unallowedField = "unallowedValue";

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should call UpdateTransactionService with correct params", async () => {
    const { sut, updateTransactionService } = makeSut();
    const req = createReq();

    const executeSpy = jest.spyOn(updateTransactionService, "execute");
    await sut.execute(req, res);

    expect(executeSpy).toHaveBeenCalledWith(req.params.transactionId, {
      title: req.body.title,
      date: req.body.date,
      amount: req.body.amount,
      type: req.body.type,
    });
  });

  it("should return 200 when updating with partial data", async () => {
    const { sut } = makeSut();
    const req = createReq({ title: undefined, date: undefined });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 500 if UpdateTransactionService throws", async () => {
    const { sut, updateTransactionService } = makeSut();
    const req = createReq();

    jest.spyOn(updateTransactionService, "execute").mockRejectedValueOnce(new Error());

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
