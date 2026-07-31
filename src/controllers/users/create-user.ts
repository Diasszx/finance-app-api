import type { Request, Response } from "express";
import { createUserSchema } from "../../schemas/users/create-user.schema.js";
import { ZodError } from "zod";
import { created, badRequest, internalServerError } from "../utils/http-response.js";
import { EmailAlreadyInUseError } from "../../erros/user.js";
import type { CreateUserServiceInterface } from "../../services/interfaces/create-user.js";

export class CreateUserController {
  constructor(private readonly createUserService: CreateUserServiceInterface) {}
  async execute(req: Request, res: Response) {
    try {
      const params = req.body;
      const body = createUserSchema.parse(params);
      const user = await this.createUserService.execute(body);
      return created(res, user);
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError || error instanceof EmailAlreadyInUseError) {
        return badRequest(res, error);
      }

      return internalServerError(res);
    }
  }
}
