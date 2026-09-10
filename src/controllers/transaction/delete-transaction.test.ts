import { faker } from "@faker-js/faker";
import type { Transaction } from "../../entities/transaction.entity.js";
import type { DeleteTransactionServiceInterface } from "../../services/interfaces/transaction/delete-transaction.js";
import { DeleteTransactionController } from "./delete-transaction.js";
import type { Request, Response } from "express";
import { jest } from "@jest/globals";
import type { GetTransactionByIdParamsDTO } from "../../schemas/transaction/get-transaction-by-id.schema.js";
import { TransactionType } from "../../generated/prisma/enums.js";

describe("DeleteTransactionController", () => {
  class DeleteTransactionServiceStub implements DeleteTransactionServiceInterface {
    async execute(): Promise<Transaction | null> {
      return {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        title: faker.string.alpha({ length: 10 }),
        date: faker.date.future().toISOString().slice(0, 10),
        amount: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
        type: faker.helpers.arrayElement(Object.values(TransactionType)),
      };
    }
  }

  const makeSut = () => {
    const deleteTransactionService = new DeleteTransactionServiceStub();
    const sut = new DeleteTransactionController(deleteTransactionService);
    return { sut, deleteTransactionService };
  };

  const req = {
    params: {
      transactionId: faker.string.uuid(),
    },
  } as unknown as Request<GetTransactionByIdParamsDTO>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  it("should return 200 when deleting a transaction successfully", async () => {
    const { sut } = makeSut();

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 400 when transactionId is invalid", async () => {
    const { sut } = makeSut();
    const invalidReq = {
      params: {
        transactionId: "invalid-uuid",
      },
    } as unknown as Request<GetTransactionByIdParamsDTO>;

    await sut.execute(invalidReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 404 if transaction is not found", async () => {
    const { sut, deleteTransactionService } = makeSut();
    jest.spyOn(deleteTransactionService, "execute").mockResolvedValueOnce(null);

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should call DeleteTransactionService with correct params", async () => {
    const { sut, deleteTransactionService } = makeSut();

    const executeSpy = jest.spyOn(deleteTransactionService, "execute");
    await sut.execute(req, res);

    expect(executeSpy).toHaveBeenCalledWith(req.params.transactionId);
  });

  it("should return 500 if DeleteTransactionService throws", async () => {
    const { sut, deleteTransactionService } = makeSut();
    jest.spyOn(deleteTransactionService, "execute").mockRejectedValueOnce(new Error());

    await sut.execute(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
