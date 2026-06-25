import { transactionRepository } from '../repositories';
import type { Transaction, TransactionId } from '../models';

export const transactionService = {
  getAll(): Promise<Transaction[]> {
    return transactionRepository.getAll();
  },

  getById(id: TransactionId): Promise<Transaction | null> {
    return transactionRepository.getById(id);
  },
};
