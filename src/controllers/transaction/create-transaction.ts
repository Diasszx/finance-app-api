import type { Request, Response } from "express";
import { badRequest, created, internalServerError } from "../utils/http-response.js";
import { createTransactionSchema } from "../../schemas/transaction/create-transaction.schema.js";
import type { CreateTransactionServiceInterface } from "../../services/interfaces/transaction/create-transaction.js";
import { ZodError } from "zod";
import { getUserByIdSchema } from "../../schemas/users/get-user-by-id.schema.js";

export class CreateTransactionController {
  constructor(private readonly createTransactionService: CreateTransactionServiceInterface) {}
  async execute(req: Request, res: Response) {
    try {
      const { userId } = getUserByIdSchema.parse(req.params);
      const params = req.body;
      const body = createTransactionSchema.parse(params);
      const transaction = await this.createTransactionService.execute(userId, body);
      return created(res, transaction);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) {
        return badRequest(res, error);
      }
      return internalServerError(res);
    }
  }
}
