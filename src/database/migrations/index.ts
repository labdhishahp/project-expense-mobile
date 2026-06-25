import type { SQLiteDatabase } from 'expo-sqlite';

import { wrapDatabaseError } from '../errors';
import { SCHEMA_VERSION } from '../schema';
import { migrations } from './migrations';

export { SCHEMA_VERSION as CURRENT_SCHEMA_VERSION };

async function getAppliedVersion(db: SQLiteDatabase): Promise<number> {
  const tableExists = await db.getFirstAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'schema_migrations'",
  );

  if (!tableExists) {
    return 0;
  }

  const result = await db.getFirstAsync<{ version: number | null }>(
    'SELECT MAX(version) AS version FROM schema_migrations',
  );

  return result?.version ?? 0;
}

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  try {
    await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.execAsync('PRAGMA foreign_keys = ON;');

    const appliedVersion = await getAppliedVersion(db);
    const pending = migrations.filter((migration) => migration.version > appliedVersion);

    for (const migration of pending) {
      await db.withTransactionAsync(async () => {
        await migration.up(db);
        await db.runAsync(
          'INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)',
          migration.version,
          new Date().toISOString(),
        );
      });
    }

    if (SCHEMA_VERSION !== migrations[migrations.length - 1]?.version) {
      throw new Error(
        `SCHEMA_VERSION (${SCHEMA_VERSION}) does not match latest migration.`,
      );
    }
  } catch (error) {
    throw wrapDatabaseError(error, 'Failed to run database migrations');
  }
}
