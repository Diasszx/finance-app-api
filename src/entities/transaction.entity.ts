export type TransactionType = "EARNING" | "EXPENSE" | "INVESTMENT";

export interface Transaction {
  id: string;
  userId: string;
  name: string;
  date: Date;
  amount: number;
  type: TransactionType;
}
