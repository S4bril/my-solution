import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

export const setupDb = async () => {
  const db = await open({
    filename: ':memory:',
    driver: sqlite3.Database,
  });

  await db.run('PRAGMA foreign_keys = ON');

  await db.migrate({
    migrationsPath: './migrations',
  });
  console.log('[db]: Migrations applied');

  return db;
};
