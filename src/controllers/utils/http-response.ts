import type { Response } from "express";

export function created(res: Response, data: unknown) {
  return res.status(201).json(data);
}

export function ok(res: Response, data: unknown) {
  return res.status(200).json(data);
}

export function badRequest(res: Response, error: unknown) {
  return res.status(400).json({
    message: "Dados inválidos",
    errors: error,
  });
}

export function internalServerError(res: Response) {
  return res.status(500).json({
    message: "Erro interno do servidor.",
  });
}
