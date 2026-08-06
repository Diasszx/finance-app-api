import z from "zod";
import { transactionTypeSchema } from "./transaction-type.schema.js";

export const updateTransactionSchema = z.object({
  title: z.string().min(2, "O título deve ter pelo menos 2 caracteres.").optional(),
  date: z.iso.date().optional(),
  amount: z
    .number()
    .min(0.01, "O valor deve ser de pelo menos R$ 0,01.")
    .refine((value) => {
      const decimals = value.toString().split(".")[1];
      return !decimals || decimals.length <= 2;
    }, "O valor deve ter no máximo 2 casas decimais.")
    .optional(),
  type: transactionTypeSchema.optional(),
});

export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
