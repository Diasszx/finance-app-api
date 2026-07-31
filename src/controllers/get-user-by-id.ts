import type { Request, Response } from "express";
import {
  badRequest,
  internalServerError,
  notFound,
  ok,
} from "../controllers/utils/http-response.js";
import {
  getUserByIdSchema,
  type GetUserByIdParamsDTO,
} from "../schemas/users/get-user-by-id.schema.js";
import { ZodError } from "zod";
import type { GetUserByIdService } from "../services/get-user-by-id.js";

export class GetUserByIdController {
  constructor(service: GetUserByIdService) {
    this.service = service;
  }
  async execute(req: Request<GetUserByIdParamsDTO>, res: Response) {
    try {
      const { userId } = getUserByIdSchema.parse(req.params);

      const user = await this.service.execute(userId);

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
