import type { MonthKey, MonthlySummary } from '../models';
import { transactionRepository } from '../repositories';

export const summaryService = {
  async getMonthlySummary(_month: MonthKey): Promise<MonthlySummary> {
    const transactions = await transactionRepository.getAll();

    return {
      month: _month,
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: transactions.length,
    };
  },
};
