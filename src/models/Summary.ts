import type { Transaction } from './Transaction';

export type Summary = {
  currentBalance: number;
  incomeThisMonth: number;
  expenseThisMonth: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Transaction[];
};
