import z from "zod";

export const updateUserSchema = z
  .object({
    firstName: z.string().min(2, "O primeiro nome deve ter pelo menos 2 caracteres.").optional(),
    lastName: z.string().min(2, "O sobrenome deve ter pelo menos 2 caracteres.").optional(),
    email: z.email("O e-mail informado é inválido.").optional(),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres.").optional(),
  })
  .strict();

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
