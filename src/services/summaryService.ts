import {
  type MonthKey,
  type MonthlySummary,
  type Summary,
  TransactionType,
} from '../models';
import { transactionRepository } from '../repositories';
import {
  calculateMonthlyBalance,
  getCurrentMonthKey,
} from '../utils';

const DEFAULT_RECENT_LIMIT = 10;

export const summaryService = {
  async getSummary(recentLimit = DEFAULT_RECENT_LIMIT): Promise<Summary> {
    const month = getCurrentMonthKey();

    const [
      totalIncome,
      totalExpense,
      incomeThisMonth,
      expenseThisMonth,
      recentTransactions,
    ] = await Promise.all([
      transactionRepository.sumByType(TransactionType.INCOME),
      transactionRepository.sumByType(TransactionType.EXPENSE),
      transactionRepository.sumByTypeForMonth(TransactionType.INCOME, month),
      transactionRepository.sumByTypeForMonth(TransactionType.EXPENSE, month),
      transactionRepository.getRecent(recentLimit),
    ]);

    return {
      currentBalance: totalIncome - totalExpense,
      incomeThisMonth,
      expenseThisMonth,
      totalIncome,
      totalExpense,
      recentTransactions,
    };
  },

  async getMonthlySummary(month: MonthKey): Promise<MonthlySummary> {
    const [transactions, totalIncome, totalExpense] = await Promise.all([
      transactionRepository.getByMonth(month),
      transactionRepository.sumByTypeForMonth(TransactionType.INCOME, month),
      transactionRepository.sumByTypeForMonth(TransactionType.EXPENSE, month),
    ]);

    return {
      month,
      totalIncome,
      totalExpense,
      balance: calculateMonthlyBalance(totalIncome, totalExpense),
      transactionCount: transactions.length,
    };
  },

  getCurrentBalance(): Promise<number> {
    return Promise.all([
      transactionRepository.sumByType(TransactionType.INCOME),
      transactionRepository.sumByType(TransactionType.EXPENSE),
    ]).then(([income, expense]) => income - expense);
  },

  getIncomeThisMonth(month: MonthKey = getCurrentMonthKey()): Promise<number> {
    return transactionRepository.sumByTypeForMonth(TransactionType.INCOME, month);
  },

  getExpenseThisMonth(month: MonthKey = getCurrentMonthKey()): Promise<number> {
    return transactionRepository.sumByTypeForMonth(TransactionType.EXPENSE, month);
  },

  getTotalIncome(): Promise<number> {
    return transactionRepository.sumByType(TransactionType.INCOME);
  },

  getTotalExpense(): Promise<number> {
    return transactionRepository.sumByType(TransactionType.EXPENSE);
  },

  getRecentTransactions(limit = DEFAULT_RECENT_LIMIT) {
    return transactionRepository.getRecent(limit);
  },
};
