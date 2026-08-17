import { TransactionType } from "../generated/prisma/enums.js";
export interface Transaction {
  id: string;
  userId: string;
  title: string;
  date: string;
  amount: number;
  type: TransactionType;
}
