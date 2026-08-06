import z from "zod";

export const getTransactionByIdSchema = z.object({
  transactionId: z.uuid("UUID inválido."),
});

export type GetTransactionByIdParamsDTO = z.infer<typeof getTransactionByIdSchema>;
