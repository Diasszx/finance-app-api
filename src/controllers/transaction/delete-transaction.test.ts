import type { Transaction } from "../../entities/transaction.entity.js";
import type { DeleteTransactionServiceInterface } from "../../services/interfaces/transaction/delete-transaction.js";
import { DeleteTransactionController } from "./delete-transaction.js";
import type { Request, Response } from "express";
import { jest } from "@jest/globals";
import type { GetTransactionByIdParamsDTO } from "../../schemas/transaction/get-transaction-by-id.schema.js";
import { transaction } from "../../tests/index.js";

describe("DeleteTransactionController", () => {
  class DeleteTransactionServiceStub implements DeleteTransactionServiceInterface {
    async execute(): Promise<Transaction | null> {
      return transaction;
    }
  }

  const makeSut = () => {
    const deleteTransactionService = new DeleteTransactionServiceStub();
    const sut = new DeleteTransactionController(deleteTransactionService);
    return { sut, deleteTransactionService };
  };

  const req = {
    params: {
      transactionId: transaction.id,
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
