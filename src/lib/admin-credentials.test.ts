import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_ADMIN_PASSWORD_HASH,
  hashAdminPassword,
  isDefaultAdminCredential,
  normalizeAdminUsername,
  validateAdminUsername,
  validateNewAdminPassword,
  updateAdminCredential,
  verifyAdminLoginPassword,
} from './admin-credentials.ts';
import { canAccessAdminRoute, isAdminRole, verifyPasswordHash, type AdminRole } from './auth.ts';

test('default admin credential fails closed without a configured bootstrap password', async () => {
  const defaultCredential = {
    username: 'admin',
    passwordHash: DEFAULT_ADMIN_PASSWORD_HASH,
  };
  assert.equal(isDefaultAdminCredential(defaultCredential), true);
  assert.equal(await verifyAdminLoginPassword('admin', defaultCredential, ''), false);
  assert.equal(await verifyAdminLoginPassword('admin', defaultCredential, 'short'), false);
  assert.equal(
    await verifyAdminLoginPassword('bootstrap-secret-1234', defaultCredential, 'bootstrap-secret-1234'),
    true,
  );
  assert.equal(
    await verifyAdminLoginPassword('admin', defaultCredential, 'bootstrap-secret-1234'),
    false,
  );
});

test('default admin rotates with the configured bootstrap password', async () => {
  const row = {
    id: 1,
    username: 'admin',
    display_name: 'Admin',
    email: null,
    role: 'owner',
    password_hash: DEFAULT_ADMIN_PASSWORD_HASH,
    must_change_password: 1,
    updated_at: '2026-08-16T00:00:00.000Z',
  };
  let updateValues: unknown[] | null = null;
  const database = {
    prepare(sql: string) {
      return {
        bind(...values: unknown[]) {
          return {
            async first() {
              return sql.includes('SELECT') ? row : null;
            },
            async run() {
              updateValues = values;
              return { meta: { changes: 1 } };
            },
          };
        },
      };
    },
  } as unknown as D1Database;

  const result = await updateAdminCredential(
    database,
    'admin',
    'bootstrap-secret-1234',
    'paduka.admin',
    'safe-password-123',
    'bootstrap-secret-1234',
  );

  assert.equal(result.ok, true);
  assert.equal(updateValues?.[0], 'paduka.admin');
  assert.equal(updateValues?.[3], 1);
  assert.equal(updateValues?.[4], DEFAULT_ADMIN_PASSWORD_HASH);
});

test('new password hashes use random salts and the bootstrap secret stops working after rotation', async () => {
  const first = await hashAdminPassword('safe-password-123');
  const second = await hashAdminPassword('safe-password-123');
  assert.notEqual(first, second);
  assert.equal(await verifyPasswordHash('safe-password-123', first), true);
  assert.equal(await verifyPasswordHash('safe-password-124', first), false);
  assert.equal(
    await verifyAdminLoginPassword(
      'bootstrap-secret-1234',
      { username: 'admin', passwordHash: first },
      'bootstrap-secret-1234',
    ),
    false,
  );
});

test('admin usernames are normalized and restricted to URL-safe characters', () => {
  assert.equal(normalizeAdminUsername('  Paduka.Admin  '), 'paduka.admin');
  assert.equal(validateAdminUsername('paduka.admin'), true);
  assert.equal(validateAdminUsername('paduka admin'), false);
  assert.equal(validateAdminUsername('ab'), false);
});

test('new admin passwords reject weak defaults', () => {
  assert.equal(validateNewAdminPassword('abc', 'admin'), 'Password baru harus berisi 8–128 karakter.');
  assert.equal(validateNewAdminPassword('admin', 'admin'), 'Password baru tidak boleh menggunakan username atau password default.');
});

test("operator roles use one deny-by-default route policy", () => {
  assert.equal(isAdminRole("owner"), true);
  assert.equal(isAdminRole("admin"), true);
  assert.equal(isAdminRole("advertiser"), true);
  assert.equal(isAdminRole("customer_service"), true);
  assert.equal(isAdminRole("guest" as AdminRole), false);

  assert.equal(canAccessAdminRoute("owner", "/admin/settings"), true);
  assert.equal(canAccessAdminRoute("admin", "/admin/settings"), true);
  assert.equal(canAccessAdminRoute("advertiser", "/admin/settings"), false);
  assert.equal(canAccessAdminRoute("customer_service", "/admin/orders"), true);
  assert.equal(canAccessAdminRoute("customer_service", "/admin/settings"), false);
  assert.equal(canAccessAdminRoute("advertiser", "/admin/content"), true);
  assert.equal(canAccessAdminRoute("advertiser", "/admin/products"), true);
});
