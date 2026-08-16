import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';

const migrationsDirectory = new URL('../db/migrations/', import.meta.url);

test('a fresh database applies every migration without pre-existing tenant data', () => {
  const database = new DatabaseSync(':memory:');
  database.exec('PRAGMA foreign_keys = ON');

  const migrations = readdirSync(migrationsDirectory)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const migration of migrations) {
    const sql = readFileSync(new URL(migration, migrationsDirectory), 'utf8')
      .replaceAll('--> statement-breakpoint', '');

    assert.doesNotThrow(
      () => database.exec(sql),
      `fresh schema migration ${migration} must apply`,
    );
  }

  assert.deepEqual(database.prepare('PRAGMA foreign_key_check').all(), []);
  assert.equal(database.prepare('SELECT COUNT(*) AS count FROM products').get()!.count, 0);
  assert.equal(database.prepare('SELECT COUNT(*) AS count FROM product_variants').get()!.count, 0);
  assert.equal(database.prepare('SELECT COUNT(*) AS count FROM admin_credentials').get()!.count, 1);

  database.close();
});
