import type { Request, Response } from "express";
import { updateUserSchema, type UpdateUserDTO } from "../schemas/users/update-user.schema.js";
import { ZodError } from "zod";
import { badRequest, ok, internalServerError } from "./utils/http-response.js";
import { FieldNotExists } from "../erros/fields.js";
import { UpdateUserService } from "../services/update-users.js";
import { getUserByIdSchema } from "../schemas/users/get-user-by-id.schema.js";
import { EmailAlreadyInUseError } from "../erros/user.js";

export class UpdateUserController {
  async execute(req: Request<UpdateUserDTO>, res: Response) {
    try {
      const { userId } = getUserByIdSchema.parse(req.params);
      const user = updateUserSchema.parse(req.body);
      const updateUserService = new UpdateUserService();
      const updateUser = await updateUserService.execute(userId, user);
      return ok(res, updateUser);
    } catch (error) {
      console.log(error);
      if (
        error instanceof ZodError ||
        error instanceof FieldNotExists ||
        error instanceof EmailAlreadyInUseError
      ) {
        return badRequest(res, error);
      }

      return internalServerError(res);
    }
  }
}
