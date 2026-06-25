import type { CategoryId } from './Category';

export type TransactionId = string;

export type TransactionType = 'expense' | 'income';

export type Transaction = {
  id: TransactionId;
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  note?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};
