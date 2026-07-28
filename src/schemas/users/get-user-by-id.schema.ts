import z from "zod";

export const getUserByIdSchema = z.object({
  userId: z.uuid("UUID inválido."),
});

export type GetUserByIdParamsDTO = z.infer<typeof getUserByIdSchema>;
