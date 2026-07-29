import type { Response } from "express";
import { ZodError } from "zod";

export function created(res: Response, data: unknown) {
  return res.status(201).json(data);
}

export function ok(res: Response, data: unknown) {
  return res.status(200).json(data);
}

export function badRequest(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  }

  if (error instanceof Error) {
    return res.status(400).json({
      message: "Dados inválidos",
      errors: {
        name: error.name,
        message: error.message,
      },
    });
  }

  return res.status(400).json({
    message: "Dados inválidos",
    errors: error,
  });
}

export function notFound(res: Response) {
  return res.status(404).json({
    message: "Usuário não encontrado",
  });
}

export function internalServerError(res: Response) {
  return res.status(500).json({
    message: "Erro interno do servidor.",
  });
}
