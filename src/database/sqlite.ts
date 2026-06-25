import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { runMigrations } from './migrations';

export const DATABASE_NAME = 'expense.db';

let database: SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLiteDatabase> {
  if (!database) {
    database = await openDatabaseAsync(DATABASE_NAME);
  }

  return database;
}

export async function initializeDatabase(): Promise<SQLiteDatabase> {
  const db = await getDatabase();
  await runMigrations(db);
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (database) {
    await database.closeAsync();
    database = null;
  }
}
