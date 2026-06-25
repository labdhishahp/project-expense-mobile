import type { Transaction, TransactionId } from '../models';

export const transactionRepository = {
  async getAll(): Promise<Transaction[]> {
    return [];
  },

  async getById(_id: TransactionId): Promise<Transaction | null> {
    return null;
  },

  async create(
    _transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Transaction> {
    throw new Error('Not implemented');
  },

  async update(_transaction: Transaction): Promise<Transaction> {
    throw new Error('Not implemented');
  },

  async delete(_id: TransactionId): Promise<void> {
    throw new Error('Not implemented');
  },
};
