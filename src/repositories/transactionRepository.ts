import type { SQLiteDatabase } from 'expo-sqlite';

import {
  type CreateTransactionInput,
  type MonthKey,
  type Transaction,
  type TransactionId,
  type TransactionType,
  type UpdateTransactionInput,
  TransactionType as TransactionTypeEnum,
} from '../models';
import { NotFoundError, wrapDatabaseError } from '../database/errors';
import {
  type TransactionRow,
  mapTransactionRow,
} from '../database/mappers';
import { getDatabase } from '../database/sqlite';
import { getMonthDateRange } from '../utils/date';
import { generateId } from '../utils/id';
import { nowISOString } from '../utils/date';

const SELECT_TRANSACTION = `
  SELECT
    id,
    type,
    amount,
    category_id,
    description,
    date,
    created_at,
    updated_at
  FROM transactions
`;

const ORDER_BY_RECENT = 'ORDER BY date DESC, created_at DESC';

function mapRows(rows: TransactionRow[]): Transaction[] {
  return rows.map(mapTransactionRow);
}

async function queryAll(db: SQLiteDatabase, where = '', params: unknown[] = []): Promise<Transaction[]> {
  const rows = await db.getAllAsync<TransactionRow>(
    `${SELECT_TRANSACTION} ${where} ${ORDER_BY_RECENT}`.trim(),
    ...(params as never[]),
  );
  return mapRows(rows);
}

export const transactionRepository = {
  async getAll(): Promise<Transaction[]> {
    try {
      const db = await getDatabase();
      return await queryAll(db);
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to fetch transactions');
    }
  },

  async getById(id: TransactionId): Promise<Transaction | null> {
    try {
      const db = await getDatabase();
      const row = await db.getFirstAsync<TransactionRow>(
        `${SELECT_TRANSACTION} WHERE id = ?`,
        id,
      );
      return row ? mapTransactionRow(row) : null;
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to fetch transaction');
    }
  },

  async create(input: CreateTransactionInput): Promise<Transaction> {
    try {
      const db = await getDatabase();
      const id = generateId();
      const timestamp = nowISOString();

      await db.runAsync(
        `INSERT INTO transactions (
          id, type, amount, category_id, description, date, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        id,
        input.type,
        input.amount,
        input.categoryId,
        input.description?.trim() ?? '',
        input.date,
        timestamp,
        timestamp,
      );

      const created = await this.getById(id);
      if (!created) {
        throw new Error('Transaction was created but could not be retrieved.');
      }

      return created;
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to create transaction');
    }
  },

  async update(input: UpdateTransactionInput): Promise<Transaction> {
    try {
      const existing = await this.getById(input.id);
      if (!existing) {
        throw new NotFoundError('Transaction', input.id);
      }

      const db = await getDatabase();
      const updatedAt = nowISOString();

      await db.runAsync(
        `UPDATE transactions
         SET
           type = ?,
           amount = ?,
           category_id = ?,
           description = ?,
           date = ?,
           updated_at = ?
         WHERE id = ?`,
        input.type ?? existing.type,
        input.amount ?? existing.amount,
        input.categoryId ?? existing.categoryId,
        input.description?.trim() ?? existing.description,
        input.date ?? existing.date,
        updatedAt,
        input.id,
      );

      const updated = await this.getById(input.id);
      if (!updated) {
        throw new NotFoundError('Transaction', input.id);
      }

      return updated;
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to update transaction');
    }
  },

  async delete(id: TransactionId): Promise<void> {
    try {
      const existing = await this.getById(id);
      if (!existing) {
        throw new NotFoundError('Transaction', id);
      }

      const db = await getDatabase();
      await db.runAsync('DELETE FROM transactions WHERE id = ?', id);
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to delete transaction');
    }
  },

  async getByCategory(categoryId: string): Promise<Transaction[]> {
    try {
      const db = await getDatabase();
      return await queryAll(db, 'WHERE category_id = ?', [categoryId]);
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to fetch transactions by category');
    }
  },

  async getByMonth(month: MonthKey): Promise<Transaction[]> {
    try {
      const { start, end } = getMonthDateRange(month);
      return await this.getByDateRange(start, end);
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to fetch transactions by month');
    }
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    try {
      const db = await getDatabase();
      return await queryAll(db, 'WHERE date >= ? AND date <= ?', [startDate, endDate]);
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to fetch transactions by date range');
    }
  },

  async getAllByType(type: TransactionType): Promise<Transaction[]> {
    try {
      const db = await getDatabase();
      return await queryAll(db, 'WHERE type = ?', [type]);
    } catch (error) {
      throw wrapDatabaseError(error, `Failed to fetch ${type.toLowerCase()} transactions`);
    }
  },

  async getAllIncome(): Promise<Transaction[]> {
    return this.getAllByType(TransactionTypeEnum.INCOME);
  },

  async getAllExpenses(): Promise<Transaction[]> {
    return this.getAllByType(TransactionTypeEnum.EXPENSE);
  },

  async getRecent(limit = 10): Promise<Transaction[]> {
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<TransactionRow>(
        `${SELECT_TRANSACTION} ${ORDER_BY_RECENT} LIMIT ?`,
        limit,
      );
      return mapRows(rows);
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to fetch recent transactions');
    }
  },

  async sumByType(type: TransactionType): Promise<number> {
    try {
      const db = await getDatabase();
      const result = await db.getFirstAsync<{ total: number | null }>(
        'SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = ?',
        type,
      );
      return result?.total ?? 0;
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to sum transactions');
    }
  },

  async sumByTypeForMonth(type: TransactionType, month: MonthKey): Promise<number> {
    try {
      const { start, end } = getMonthDateRange(month);
      const db = await getDatabase();
      const result = await db.getFirstAsync<{ total: number | null }>(
        `SELECT COALESCE(SUM(amount), 0) AS total
         FROM transactions
         WHERE type = ? AND date >= ? AND date <= ?`,
        type,
        start,
        end,
      );
      return result?.total ?? 0;
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to sum monthly transactions');
    }
  },
};
