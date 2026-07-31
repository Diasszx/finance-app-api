import type { TransactionType } from "../schemas/transaction/transaction-type.schema.js";

export interface Transaction {
  id: string;
  userId: string;
  name: string;
  date: string;
  amount: number;
  type: TransactionType;
}
