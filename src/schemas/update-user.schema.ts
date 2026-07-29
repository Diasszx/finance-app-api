import z from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  email: z.email().optional(),
  password: z.string().min(8).optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
