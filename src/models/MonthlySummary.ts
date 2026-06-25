export type MonthKey = string;

export type MonthlySummary = {
  month: MonthKey;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
};
