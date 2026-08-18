import { faker } from "@faker-js/faker";
import type { Transaction } from "../../entities/transaction.entity.js";
import type { CreateTransactionDTO } from "../../schemas/transaction/create-transaction.schema.js";
import type { CreateTransactionServiceInterface } from "../../services/interfaces/transaction/create-transaction.js";
import { TransactionType } from "../../generated/prisma/enums.js";
import { CreateTransactionController } from "./create-transaction.js";
import type { Request, Response } from "express";
import { jest } from "@jest/globals";
import { UserNotFoundError } from "../../erros/userId.js";

describe("CreateTransactionController", () => {
  class CreateTransactionServiceStub implements CreateTransactionServiceInterface {
    async execute(userId: string, transaction: CreateTransactionDTO): Promise<Transaction> {
      return {
        id: faker.string.uuid(),
        userId: userId,
        title: transaction.title,
        date: transaction.date,
        amount: transaction.amount,
        type: transaction.type,
      };
    }
  }

  const makeSut = () => {
    const createTransactionService = new CreateTransactionServiceStub();
    const sut = new CreateTransactionController(createTransactionService);
    return { sut, createTransactionService };
  };

  const createReq = (overrides = {}) =>
    ({
      params: {
        userId: faker.string.uuid(),
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

  it("should return 201 when creating a transaction successfully", async () => {
    const { sut } = makeSut();
    const req = createReq();

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        userId: req.params.userId,
        title: req.body.title,
        date: req.body.date,
        amount: req.body.amount,
        type: req.body.type,
      }),
    );
  });

  it("should return 400 when userId is invalid", async () => {
    const { sut } = makeSut();
    const req = createReq();
    req.params.userId = "invalid-uuid";

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when title is not provided", async () => {
    const { sut } = makeSut();
    const req = createReq({ title: undefined });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when title has less than 2 characters", async () => {
    const { sut } = makeSut();
    const req = createReq({ title: "a" });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when date is not provided", async () => {
    const { sut } = makeSut();
    const req = createReq({ date: undefined });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when date is invalid", async () => {
    const { sut } = makeSut();
    const req = createReq({ date: "invalid-date" });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when amount is not provided", async () => {
    const { sut } = makeSut();
    const req = createReq({ amount: undefined });

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

  it("should return 400 when type is not provided", async () => {
    const { sut } = makeSut();
    const req = createReq({ type: undefined });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 when type is invalid", async () => {
    const { sut } = makeSut();
    const req = createReq({ type: "INVALID_TYPE" });

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should call CreateTransactionService with correct params", async () => {
    const { sut, createTransactionService } = makeSut();
    const req = createReq();

    const executeSpy = jest.spyOn(createTransactionService, "execute");
    await sut.execute(req, res);

    expect(executeSpy).toHaveBeenCalledWith(req.params.userId, {
      title: req.body.title,
      date: req.body.date,
      amount: req.body.amount,
      type: req.body.type,
    });
  });

  it("should return 500 if CreateTransactionService throws", async () => {
    const { sut, createTransactionService } = makeSut();
    const req = createReq();

    jest.spyOn(createTransactionService, "execute").mockRejectedValueOnce(new Error());

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 400 if CreateTransactionService throws UserNotFoundError", async () => {
    const { sut, createTransactionService } = makeSut();
    const req = createReq();
    const userId = faker.string.uuid();

    jest
      .spyOn(createTransactionService, "execute")
      .mockRejectedValueOnce(new UserNotFoundError(userId));

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
