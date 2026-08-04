import z from "zod";

export const getTransactionByUserIdQuerySchema = z.object({
  userId: z.uuid("UUID inválido."),
});

export type GetTransactionByIdQueryDTO = z.infer<typeof getTransactionByUserIdQuerySchema>;
