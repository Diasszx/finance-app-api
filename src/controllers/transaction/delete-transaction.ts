import type { Request, Response } from "express";
import type { DeleteTransactionServiceInterface } from "../../services/interfaces/transaction/delete-transaction.js";
import {
  getTransactionByIdSchema,
  type GetTransactionByIdParamsDTO,
} from "../../schemas/transaction/get-transaction-by-id.schema.js";
import { badRequest, internalServerError, notFound, ok } from "../utils/http-response.js";
import { ZodError } from "zod";

export class DeleteTransactionController {
  constructor(private readonly deleteTransactionService: DeleteTransactionServiceInterface) {}
  async execute(req: Request<GetTransactionByIdParamsDTO>, res: Response) {
    try {
      const { transactionId } = getTransactionByIdSchema.parse(req.params);
      const transaction = await this.deleteTransactionService.execute(transactionId);
      if (!transaction) {
        notFound(res);
      }
      return ok(res, transaction);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(res, error);
      }
      return internalServerError(res);
    }
  }
}
