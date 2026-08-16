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

  database.exec(`
    INSERT INTO stores (id, name, slug, created_at)
    VALUES (1, 'Test Store', 'test-store', '2026-08-16T00:00:00.000Z');
    INSERT INTO products (id, store_id, title, slug, created_at)
    VALUES (22, 1, 'Test Product', 'test-product', '2026-08-16T00:00:00.000Z');
    INSERT INTO product_variants (id, product_id, sku, title, price)
    VALUES (106, 22, 'TEST-106', 'Black', 128500);
  `);
  assert.throws(
    () => database.exec('UPDATE product_variants SET id = 206 WHERE id = 106'),
    /immutable external catalog identifier/,
  );
  assert.equal(
    database.prepare('SELECT id FROM product_variants WHERE sku = ?').get('TEST-106')!.id,
    106,
  );

  database.close();
});
