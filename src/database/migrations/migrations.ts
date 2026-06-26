import type { SQLiteDatabase } from 'expo-sqlite';

import { DEFAULT_CATEGORIES, isAllowedDefaultCategoryName } from '../../constants/categories';
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

export const migration003SyncMilestoneCategories: Migration = {
  version: 3,
  name: 'sync_milestone_categories',
  async up(db) {
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

export const migration004RemoveObsoleteDefaultCategories: Migration = {
  version: 4,
  name: 'remove_obsolete_default_categories',
  async up(db) {
    const obsoleteDefaults = await db.getAllAsync<{ id: string; name: string }>(
      'SELECT id, name FROM categories WHERE is_default = 1',
    );

    for (const category of obsoleteDefaults) {
      if (isAllowedDefaultCategoryName(category.name)) {
        continue;
      }

      const usage = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) AS count FROM transactions WHERE category_id = ?',
        category.id,
      );

      if (usage?.count === 0) {
        await db.runAsync('DELETE FROM categories WHERE id = ?', category.id);
      }
    }
  },
};

export const migrations: Migration[] = [
  migration001InitialSchema,
  migration002SeedDefaultCategories,
  migration003SyncMilestoneCategories,
  migration004RemoveObsoleteDefaultCategories,
];
