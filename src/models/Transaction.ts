import type { CategoryId } from './Category';
import type { TransactionType } from './TransactionType';

export type TransactionId = string;

export type Transaction = {
  id: TransactionId;
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTransactionInput = {
  type: TransactionType;
  amount: number;
  categoryId: CategoryId;
  description?: string;
  date: string;
};

export type UpdateTransactionInput = {
  id: TransactionId;
  type?: TransactionType;
  amount?: number;
  categoryId?: CategoryId;
  description?: string;
  date?: string;
};
