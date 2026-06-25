export const TransactionType = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export function isTransactionType(value: string): value is TransactionType {
  return value === TransactionType.INCOME || value === TransactionType.EXPENSE;
}
