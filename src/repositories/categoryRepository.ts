import type { SQLiteDatabase } from 'expo-sqlite';

import {
  type Category,
  type CategoryId,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from '../models';
import { NotFoundError, wrapDatabaseError } from '../database/errors';
import {
  type CategoryRow,
  mapCategoryRow,
} from '../database/mappers';
import { getDatabase } from '../database/sqlite';
import { generateId } from '../utils/id';

const SELECT_CATEGORY = `
  SELECT id, name, icon, color, is_default
  FROM categories
`;

const ORDER_BY_NAME = 'ORDER BY is_default DESC, name COLLATE NOCASE ASC';

async function queryAll(db: SQLiteDatabase): Promise<Category[]> {
  const rows = await db.getAllAsync<CategoryRow>(
    `${SELECT_CATEGORY} ${ORDER_BY_NAME}`,
  );
  return rows.map(mapCategoryRow);
}

export const categoryRepository = {
  async getAll(): Promise<Category[]> {
    try {
      const db = await getDatabase();
      return await queryAll(db);
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to fetch categories');
    }
  },

  async getById(id: CategoryId): Promise<Category | null> {
    try {
      const db = await getDatabase();
      const row = await db.getFirstAsync<CategoryRow>(
        `${SELECT_CATEGORY} WHERE id = ?`,
        id,
      );
      return row ? mapCategoryRow(row) : null;
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to fetch category');
    }
  },

  async getByName(name: string): Promise<Category | null> {
    try {
      const db = await getDatabase();
      const row = await db.getFirstAsync<CategoryRow>(
        `${SELECT_CATEGORY} WHERE name = ? COLLATE NOCASE`,
        name.trim(),
      );
      return row ? mapCategoryRow(row) : null;
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to fetch category by name');
    }
  },

  async create(input: CreateCategoryInput): Promise<Category> {
    try {
      const db = await getDatabase();
      const id = generateId();
      const isDefault = input.isDefault ? 1 : 0;

      await db.runAsync(
        `INSERT INTO categories (id, name, icon, color, is_default)
         VALUES (?, ?, ?, ?, ?)`,
        id,
        input.name.trim(),
        input.icon,
        input.color,
        isDefault,
      );

      const created = await this.getById(id);
      if (!created) {
        throw new Error('Category was created but could not be retrieved.');
      }

      return created;
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to create category');
    }
  },

  async update(input: UpdateCategoryInput): Promise<Category> {
    try {
      const existing = await this.getById(input.id);
      if (!existing) {
        throw new NotFoundError('Category', input.id);
      }

      const db = await getDatabase();
      const nextName = input.name?.trim() ?? existing.name;
      const nextIcon = input.icon ?? existing.icon;
      const nextColor = input.color ?? existing.color;

      await db.runAsync(
        `UPDATE categories
         SET name = ?, icon = ?, color = ?
         WHERE id = ?`,
        nextName,
        nextIcon,
        nextColor,
        input.id,
      );

      const updated = await this.getById(input.id);
      if (!updated) {
        throw new NotFoundError('Category', input.id);
      }

      return updated;
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to update category');
    }
  },

  async delete(id: CategoryId): Promise<void> {
    try {
      const existing = await this.getById(id);
      if (!existing) {
        throw new NotFoundError('Category', id);
      }

      const db = await getDatabase();
      await db.runAsync('DELETE FROM categories WHERE id = ?', id);
    } catch (error) {
      throw wrapDatabaseError(error, 'Failed to delete category');
    }
  },
};
