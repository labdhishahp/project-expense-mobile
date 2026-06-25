import type { SQLiteDatabase } from 'expo-sqlite';

import { SCHEMA_VERSION } from '../schema';

export const CURRENT_SCHEMA_VERSION = SCHEMA_VERSION;

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // Table migrations will be added in a future milestone.
}
