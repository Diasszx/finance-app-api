import type { Request, Response } from "express";
import {
  getUserByIdSchema,
  type GetUserByIdParamsDTO,
} from "../schemas/users/get-user-by-id.schema.js";
import { DeleteUserService } from "../services/delete-user.js";
import { badRequest, internalServerError, notFound, ok } from "./utils/http-response.js";
import { ZodError } from "zod";

export class DeleteUserController {
  async execute(req: Request<GetUserByIdParamsDTO>, res: Response) {
    try {
      const { userId } = getUserByIdSchema.parse(req.params);
      const service = new DeleteUserService();
      const user = await service.execute(userId);
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
