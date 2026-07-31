import { z } from "zod";

export const transactionTypeSchema = z.enum(["EARNING", "EXPENSE", "INVESTMENT"]);

export type TransactionType = z.infer<typeof transactionTypeSchema>;
