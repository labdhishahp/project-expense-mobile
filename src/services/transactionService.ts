import {
  type CreateTransactionInput,
  type MonthKey,
  type Transaction,
  type TransactionId,
  type UpdateTransactionInput,
} from '../models';
import { ValidationError } from '../database/errors';
import { categoryRepository, transactionRepository } from '../repositories';
import {
  assertISODate,
  assertPositiveAmount,
  assertTransactionType,
} from '../utils/validation';

async function assertCategoryExists(categoryId: string): Promise<void> {
  const category = await categoryRepository.getById(categoryId);
  if (!category) {
    throw new ValidationError('Selected category does not exist.');
  }
}

function validateCreateInput(input: CreateTransactionInput): void {
  assertTransactionType(input.type);
  assertPositiveAmount(input.amount);
  assertISODate(input.date);
}

function validateUpdateInput(input: UpdateTransactionInput): void {
  if (input.type !== undefined) {
    assertTransactionType(input.type);
  }
  if (input.amount !== undefined) {
    assertPositiveAmount(input.amount);
  }
  if (input.date !== undefined) {
    assertISODate(input.date);
  }
}

export const transactionService = {
  getAll(): Promise<Transaction[]> {
    return transactionRepository.getAll();
  },

  getById(id: TransactionId): Promise<Transaction | null> {
    return transactionRepository.getById(id);
  },

  async create(input: CreateTransactionInput): Promise<Transaction> {
    validateCreateInput(input);
    await assertCategoryExists(input.categoryId);
    return transactionRepository.create(input);
  },

  async update(input: UpdateTransactionInput): Promise<Transaction> {
    validateUpdateInput(input);

    if (input.categoryId) {
      await assertCategoryExists(input.categoryId);
    }

    return transactionRepository.update(input);
  },

  delete(id: TransactionId): Promise<void> {
    return transactionRepository.delete(id);
  },

  getByCategory(categoryId: string): Promise<Transaction[]> {
    return transactionRepository.getByCategory(categoryId);
  },

  getByMonth(month: MonthKey): Promise<Transaction[]> {
    return transactionRepository.getByMonth(month);
  },

  getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return transactionRepository.getByDateRange(startDate, endDate);
  },

  getAllIncome(): Promise<Transaction[]> {
    return transactionRepository.getAllIncome();
  },

  getAllExpenses(): Promise<Transaction[]> {
    return transactionRepository.getAllExpenses();
  },

  getRecent(limit = 10): Promise<Transaction[]> {
    return transactionRepository.getRecent(limit);
  },
};
