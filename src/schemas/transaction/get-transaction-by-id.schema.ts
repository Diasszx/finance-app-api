import z from "zod";

export const getTransactionByUserIdQuerySchema = z.object({
  userId: z.uuid("UUID inválido."),
});

export type GetTransactionByIdQueryDTO = z.infer<typeof getTransactionByUserIdQuerySchema>;

export const getTransactionByIdSchema = z.object({
  transactionId: z.uuid("UUID inválido."),
});

export type GetTransactionByIdParamsDTO = z.infer<typeof getTransactionByIdSchema>;
