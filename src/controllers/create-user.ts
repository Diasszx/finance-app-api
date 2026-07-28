import type { Request, Response } from "express";
import { createUserSchema } from "../schemas/users/create-user.schema.js";
import { CreateUserService } from "../services/create-user.js";
import { ZodError } from "zod";
import { created, badRequest, internalServerError } from "./utils/http-response.js";

export class CreateUserController {
  async execute(req: Request, res: Response) {
    try {
      const params = req.body;
      const body = createUserSchema.parse(params);
      const service = new CreateUserService();
      const user = await service.execute(body);
      return created(res, user);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest(res, error);
      }

      return internalServerError(res);
    }
  }
}
