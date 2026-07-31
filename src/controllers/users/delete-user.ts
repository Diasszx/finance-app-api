import type { Request, Response } from "express";
import {
  getUserByIdSchema,
  type GetUserByIdParamsDTO,
} from "../../schemas/users/get-user-by-id.schema.js";
import { badRequest, internalServerError, notFound, ok } from "../utils/http-response.js";
import { ZodError } from "zod";
import type { DeleteUserServiceInterface } from "../../services/interfaces/delete-user.js";

export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserServiceInterface) {}
  async execute(req: Request<GetUserByIdParamsDTO>, res: Response) {
    try {
      const { userId } = getUserByIdSchema.parse(req.params);
      const user = await this.deleteUserService.execute(userId);
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
