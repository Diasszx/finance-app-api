import type { Request, Response } from "express";
import type { GetUserBalanceService } from "../../services/interfaces/user/get-user-balance.js";
import { getUserByIdSchema } from "../../schemas/users/get-user-by-id.schema.js";
import { ZodError } from "zod";
import { badRequest, internalServerError, notFound, ok } from "../utils/http-response.js";
import { UserNotFoundError } from "../../erros/userId.js";

export class GetUserBalanceController {
  constructor(private readonly getUserBalanceService: GetUserBalanceService) {}
  async execute(req: Request, res: Response) {
    try {
      const { userId } = getUserByIdSchema.parse(req.params);
      const balance = await this.getUserBalanceService.execute(userId);
      return ok(res, balance);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound(res);
      }
      if (error instanceof ZodError) {
        return badRequest(res, error);
      }
      return internalServerError(res);
    }
  }
}
