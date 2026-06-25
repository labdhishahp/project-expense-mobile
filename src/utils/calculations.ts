import type { Transaction } from '../models';
import { TransactionType } from '../models';

export function sumByType(
  transactions: Transaction[],
  type: TransactionType,
): number {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function calculateBalance(transactions: Transaction[]): number {
  const income = sumByType(transactions, TransactionType.INCOME);
  const expense = sumByType(transactions, TransactionType.EXPENSE);
  return income - expense;
}

export function calculateMonthlyBalance(
  income: number,
  expense: number,
): number {
  return income - expense;
}
