import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z
    .string({ error: "O primeiro nome é obrigatório." })
    .trim()
    .min(2, "O primeiro nome deve ter pelo menos 2 caracteres."),

  lastName: z
    .string({ error: "O sobrenome é obrigatório." })
    .trim()
    .min(2, "O sobrenome deve ter pelo menos 2 caracteres."),

  email: z.email("O e-mail informado é inválido.").trim(),

  password: z
    .string({ error: "A senha é obrigatória." })
    .trim()
    .min(8, "A senha deve ter no mínimo 8 caracteres."),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
