import type { MonthKey, Transaction } from '../models';

export type TransactionMonthGroup = {
  monthKey: MonthKey;
  label: string;
  transactions: Transaction[];
};

export function formatMonthHeading(monthKey: MonthKey): string {
  const [year, monthPart] = monthKey.split('-').map(Number);
  const date = new Date(year, monthPart - 1, 1);

  return date.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
}

export function groupTransactionsByMonth(
  transactions: Transaction[],
): TransactionMonthGroup[] {
  const groups = new Map<MonthKey, Transaction[]>();

  for (const transaction of transactions) {
    const monthKey = transaction.date.slice(0, 7) as MonthKey;
    const existing = groups.get(monthKey);

    if (existing) {
      existing.push(transaction);
    } else {
      groups.set(monthKey, [transaction]);
    }
  }

  return Array.from(groups.entries())
    .sort(([leftMonth], [rightMonth]) => rightMonth.localeCompare(leftMonth))
    .map(([monthKey, monthTransactions]) => ({
      monthKey,
      label: formatMonthHeading(monthKey),
      transactions: monthTransactions,
    }));
}
