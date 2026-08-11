import z from "zod";
import { TransactionType } from "../../generated/prisma/enums.js";

export const createTransactionSchema = z.object({
  title: z
    .string({ error: "O título é obrigatório." })
    .trim()
    .min(2, "O título deve ter pelo menos 2 caracteres."),
  date: z.iso.date({ error: "A data é obrigatória." }),
  amount: z
    .number({ error: "O valor é obrigatório," })
    .min(0.01, "O valor deve ser de pelo menos R$ 0,01.")
    .refine((value) => {
      const decimals = value.toString().split(".")[1];
      return !decimals || decimals.length <= 2;
    }, "O valor deve ter no máximo 2 casas decimais."),
  type: TransactionType,
});

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
