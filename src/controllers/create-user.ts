import type { Request, Response } from "express";
import { createUserSchema } from "../schemas/users/create-user.schema.js";
import { CreateUserService } from "../services/create-user.js";
import { ZodError } from "zod";

export class CreateUserController {
  async execute(req: Request, res: Response) {
    try {
      const params = req.body;
      const body = createUserSchema.parse(params);
      const service = new CreateUserService();
      const user = await service.execute(body);
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: error.issues,
        });
      }
      return res.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  }
}
