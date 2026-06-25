import type { Category, Transaction } from '../models';
import { TransactionType, isTransactionType } from '../models';
import { ValidationError } from './errors';

export type CategoryRow = {
  id: string;
  name: string;
  icon: string;
  color: string;
  is_default: number;
};

export type TransactionRow = {
  id: string;
  type: string;
  amount: number;
  category_id: string;
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
};

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    isDefault: row.is_default === 1,
  };
}

export function mapTransactionRow(row: TransactionRow): Transaction {
  if (!isTransactionType(row.type)) {
    throw new ValidationError(`Invalid transaction type stored: ${row.type}`);
  }

  return {
    id: row.id,
    type: row.type,
    amount: row.amount,
    categoryId: row.category_id,
    description: row.description,
    date: row.date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
