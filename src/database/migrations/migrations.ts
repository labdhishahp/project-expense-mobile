import type { SQLiteDatabase } from 'expo-sqlite';

import { DEFAULT_CATEGORIES } from '../../constants/categories';
import { generateId } from '../../utils/id';
import {
  CREATE_CATEGORIES_TABLE,
  CREATE_SCHEMA_MIGRATIONS_TABLE,
  CREATE_TRANSACTION_INDEXES,
  CREATE_TRANSACTIONS_TABLE,
} from '../schema/tables';

export type Migration = {
  version: number;
  name: string;
  up: (db: SQLiteDatabase) => Promise<void>;
};

export const migration001InitialSchema: Migration = {
  version: 1,
  name: 'initial_schema',
  async up(db) {
    await db.execAsync(CREATE_SCHEMA_MIGRATIONS_TABLE);
    await db.execAsync(CREATE_CATEGORIES_TABLE);
    await db.execAsync(CREATE_TRANSACTIONS_TABLE);
    await db.execAsync(CREATE_TRANSACTION_INDEXES);
  },
};

export const migration002SeedDefaultCategories: Migration = {
  version: 2,
  name: 'seed_default_categories',
  async up(db) {
    const existing = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) AS count FROM categories WHERE is_default = 1',
    );

    if (existing && existing.count > 0) {
      return;
    }

    for (const category of DEFAULT_CATEGORIES) {
      await db.runAsync(
        `INSERT OR IGNORE INTO categories (id, name, icon, color, is_default)
         VALUES (?, ?, ?, ?, 1)`,
        generateId(),
        category.name,
        category.icon,
        category.color,
      );
    }
  },
};

export const migrations: Migration[] = [
  migration001InitialSchema,
  migration002SeedDefaultCategories,
];
