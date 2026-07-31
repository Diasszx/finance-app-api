import type { TransactionType } from "../schemas/transaction/transaction-type.schema.js";

export interface Transaction {
  id: string;
  userId: string;
  name: string;
  date: Date;
  amount: number;
  type: TransactionType;
}
