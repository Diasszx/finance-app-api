import type { Request, Response } from "express";
import { updateUserSchema, type UpdateUserDTO } from "../../schemas/users/update-user.schema.js";
import { ZodError } from "zod";
import { badRequest, ok, internalServerError } from "../utils/http-response.js";
import { FieldNotExists } from "../../erros/fields.js";
import { getUserByIdSchema } from "../../schemas/users/get-user-by-id.schema.js";
import { EmailAlreadyInUseError } from "../../erros/user.js";
import type { updateUserServiceInterface } from "../../services/interfaces/update-user.js";

export class UpdateUserController {
  constructor(private readonly updateUserService: updateUserServiceInterface) {}
  async execute(req: Request<UpdateUserDTO>, res: Response) {
    try {
      const { userId } = getUserByIdSchema.parse(req.params);
      const body = updateUserSchema.parse(req.body);
      const updateUser = await this.updateUserService.execute(userId, body);
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
