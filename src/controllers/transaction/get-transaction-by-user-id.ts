import type { Request, Response } from "express";
import { internalServerError, notFound, ok } from "../utils/http-response.js";
import { UserNotFoundError } from "../../erros/userId.js";
import type { GetTransactionByIdServiceInterface } from "../../services/interfaces/transaction/get-transaction-by-user-id.js";
import {
  getTransactionByUserIdQuerySchema,
  type GetTransactionByIdQueryDTO,
} from "../../schemas/transaction/get-transaction-by-id.schema.js";
import type { TypedRequestQuery } from "../utils/http.js";

export class GetTransactionsByUserIdController {
  constructor(
    private readonly getTransactionsByUserByidService: GetTransactionByIdServiceInterface,
  ) {}
  async execute(req: TypedRequestQuery<GetTransactionByIdQueryDTO>, res: Response) {
    try {
      const { userId } = getTransactionByUserIdQuerySchema.parse(req.query.userId);
      const transactions = await this.getTransactionsByUserByidService.execute(userId);
      return ok(res, transactions);
    } catch (error) {
      console.log(error);
      if (error instanceof UserNotFoundError) {
        return notFound(res);
      }
      return internalServerError(res);
    }
  }
}
