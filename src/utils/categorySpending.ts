import type { Category, Transaction } from '../models';
import { TransactionType } from '../models';
import { getCurrentMonthKey } from './date';

export type CategorySpendingSlice = {
  categoryId: string;
  name: string;
  color: string;
  amount: number;
  percentage: number;
};

export function buildCategorySpendingSlices(
  transactions: Transaction[],
  getCategoryById: (id: string) => Category | null,
  month: string = getCurrentMonthKey(),
): CategorySpendingSlice[] {
  const totals = new Map<string, number>();

  for (const transaction of transactions) {
    if (
      transaction.type !== TransactionType.EXPENSE ||
      !transaction.date.startsWith(month)
    ) {
      continue;
    }

    totals.set(
      transaction.categoryId,
      (totals.get(transaction.categoryId) ?? 0) + transaction.amount,
    );
  }

  const totalExpense = Array.from(totals.values()).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  if (totalExpense === 0) {
    return [];
  }

  return Array.from(totals.entries())
    .map(([categoryId, amount]) => {
      const category = getCategoryById(categoryId);

      return {
        categoryId,
        name: category?.name ?? 'Unknown',
        color: category?.color ?? '#64748B',
        amount,
        percentage: (amount / totalExpense) * 100,
      };
    })
    .sort((left, right) => right.amount - left.amount);
}
