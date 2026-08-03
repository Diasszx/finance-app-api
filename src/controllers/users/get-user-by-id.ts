import type { Request, Response } from "express";
import { badRequest, internalServerError, notFound, ok } from "../utils/http-response.js";
import {
  getUserByIdSchema,
  type GetUserByIdParamsDTO,
} from "../../schemas/users/get-user-by-id.schema.js";
import { ZodError } from "zod";
import type { getUserByIdServiceInterface } from "../../services/interfaces/user/get-user-by-id.js";

export class GetUserByIdController {
  constructor(private readonly getUserByIdService: getUserByIdServiceInterface) {}
  async execute(req: Request<GetUserByIdParamsDTO>, res: Response) {
    try {
      const { userId } = getUserByIdSchema.parse(req.params);

      const user = await this.getUserByIdService.execute(userId);

      if (!user) {
        return notFound(res);
      }

      return ok(res, user);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(res, error);
      }
      return internalServerError(res);
    }
  }
}
