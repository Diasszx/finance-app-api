import type { Request, Response } from "express";
import type { UpdateTransactionServiceInterface } from "../../services/interfaces/transaction/update-transaction.js";
import {
  updateTransactionSchema,
  type UpdateTransactionDTO,
} from "../../schemas/transaction/update-transaction.schema.js";
import { badRequest, internalServerError, ok } from "../utils/http-response.js";
import { ZodError } from "zod";
import { FieldNotExists } from "../../erros/fields.js";
import { getTransactionByIdSchema } from "../../schemas/transaction/get-transaction-by-id.schema.js";

export class UpdateTransactionController {
  constructor(private readonly updateTransactionService: UpdateTransactionServiceInterface) {}
  async execute(req: Request<UpdateTransactionDTO>, res: Response) {
    try {
      const { transactionId } = getTransactionByIdSchema.parse(req.params);
      console.log(req.params);
      const body = updateTransactionSchema.parse(req.body);
      const updateTransaction = await this.updateTransactionService.execute(transactionId, body);
      return ok(res, updateTransaction);
    } catch (error) {
      if (error instanceof ZodError || error instanceof FieldNotExists) {
        return badRequest(res, error);
      }
      return internalServerError(res);
    }
  }
}
