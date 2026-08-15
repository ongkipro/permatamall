import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_ADMIN_PASSWORD_HASH,
  hashAdminPassword,
  isDefaultAdminCredential,
  normalizeAdminUsername,
  validateAdminUsername,
  validateNewAdminPassword,
  verifyAdminLoginPassword,
} from './admin-credentials.ts';
import { canAccessAdminRoute, isAdminRole, verifyPasswordHash, type AdminRole } from './auth.ts';

test('default admin password is valid and verifies directly', async () => {
  assert.equal(await verifyPasswordHash('admin', DEFAULT_ADMIN_PASSWORD_HASH), true);
  assert.equal(await verifyPasswordHash('wrong', DEFAULT_ADMIN_PASSWORD_HASH), false);
  assert.equal(validateNewAdminPassword('abc', 'admin'), 'Password baru harus berisi 8–128 karakter.');
});

test('default admin login works with default password or configured bootstrap password', async () => {
  const defaultCredential = {
    username: 'admin',
    passwordHash: DEFAULT_ADMIN_PASSWORD_HASH,
  };
  assert.equal(isDefaultAdminCredential(defaultCredential), true);
  assert.equal(await verifyAdminLoginPassword('admin', defaultCredential, ''), true);
  assert.equal(
    await verifyAdminLoginPassword('bootstrap-secret-1234', defaultCredential, 'bootstrap-secret-1234'),
    true,
  );
  assert.equal(await verifyAdminLoginPassword('wrong-pass', defaultCredential, ''), false);
});

test('new password hashes use random salts and verify through the login contract', async () => {
  const first = await hashAdminPassword('safe-password-123');
  const second = await hashAdminPassword('safe-password-123');
  assert.notEqual(first, second);
  assert.equal(await verifyPasswordHash('safe-password-123', first), true);
  assert.equal(await verifyPasswordHash('safe-password-124', first), false);
});

test('admin usernames are normalized and restricted to URL-safe characters', () => {
  assert.equal(normalizeAdminUsername('  Paduka.Admin  '), 'paduka.admin');
  assert.equal(validateAdminUsername('paduka.admin'), true);
  assert.equal(validateAdminUsername('paduka admin'), false);
  assert.equal(validateAdminUsername('ab'), false);
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
