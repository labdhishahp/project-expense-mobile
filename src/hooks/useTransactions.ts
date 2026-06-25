import { useCallback, useEffect, useState } from 'react';

import type {
  CreateTransactionInput,
  MonthKey,
  Transaction,
  TransactionId,
  UpdateTransactionInput,
} from '../models';
import { toUserMessage } from '../database/errors';
import { transactionService } from '../services/transactionService';

type UseTransactionsState = {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
};

export function useTransactions() {
  const [state, setState] = useState<UseTransactionsState>({
    transactions: [],
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));

    try {
      const transactions = await transactionService.getAll();
      setState({ transactions, loading: false, error: null });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: toUserMessage(error),
      }));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      const transaction = await transactionService.create(input);
      await refresh();
      return transaction;
    },
    [refresh],
  );

  const updateTransaction = useCallback(
    async (input: UpdateTransactionInput) => {
      const transaction = await transactionService.update(input);
      await refresh();
      return transaction;
    },
    [refresh],
  );

  const deleteTransaction = useCallback(
    async (id: TransactionId) => {
      await transactionService.delete(id);
      await refresh();
    },
    [refresh],
  );

  const getByCategory = useCallback(
    (categoryId: string) => transactionService.getByCategory(categoryId),
    [],
  );

  const getByMonth = useCallback(
    (month: MonthKey) => transactionService.getByMonth(month),
    [],
  );

  const getByDateRange = useCallback(
    (startDate: string, endDate: string) =>
      transactionService.getByDateRange(startDate, endDate),
    [],
  );

  const getAllIncome = useCallback(() => transactionService.getAllIncome(), []);
  const getAllExpenses = useCallback(() => transactionService.getAllExpenses(), []);
  const getRecent = useCallback(
    (limit?: number) => transactionService.getRecent(limit),
    [],
  );

  return {
    transactions: state.transactions,
    loading: state.loading,
    error: state.error,
    refresh,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getByCategory,
    getByMonth,
    getByDateRange,
    getAllIncome,
    getAllExpenses,
    getRecent,
  };
}
