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
import { canAccessAdminRoute, isAdminRole, verifyPasswordHash } from './auth.ts';

test('default admin password is valid and must be replaced with a stronger password', async () => {
  assert.equal(await verifyPasswordHash('admin', DEFAULT_ADMIN_PASSWORD_HASH), true);
  assert.equal(await verifyPasswordHash('wrong', DEFAULT_ADMIN_PASSWORD_HASH), false);
  assert.match(validateNewAdminPassword('admin', 'admin'), /default/);
  assert.match(validateNewAdminPassword('newadmin', 'newadmin'), /username/);
});

test('default admin hash is blocked until bootstrap password is configured', async () => {
  const defaultCredential = {
    username: 'admin',
    passwordHash: DEFAULT_ADMIN_PASSWORD_HASH,
  };
  assert.equal(isDefaultAdminCredential(defaultCredential), true);
  assert.equal(await verifyAdminLoginPassword('admin', defaultCredential, ''), false);
  assert.equal(
    await verifyAdminLoginPassword('bootstrap-secret-1234', defaultCredential, 'bootstrap-secret-1234'),
    true,
  );
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
  assert.equal(isAdminRole("collaborator"), false);

  assert.equal(canAccessAdminRoute("owner", "/admin/settings/access"), true);
  assert.equal(canAccessAdminRoute("admin", "/admin/settings/store"), true);
  assert.equal(canAccessAdminRoute("admin", "/admin/settings/access"), false);
  assert.equal(canAccessAdminRoute("admin", "/api/admin/access"), false);

  assert.equal(canAccessAdminRoute("advertiser", "/admin/products/edit"), true);
  assert.equal(canAccessAdminRoute("advertiser", "/api/admin/media"), true);
  assert.equal(canAccessAdminRoute("advertiser", "/admin/orders"), false);
  assert.equal(canAccessAdminRoute("advertiser", "/api/admin/orders/42"), false);

  assert.equal(canAccessAdminRoute("customer_service", "/admin/orders/INV-1"), true);
  assert.equal(canAccessAdminRoute("customer_service", "/api/admin/orders/42"), true);
  assert.equal(canAccessAdminRoute("customer_service", "/api/admin/settings"), false);
  assert.equal(canAccessAdminRoute("customer_service", "/api/admin/ongkir"), true);
  assert.equal(canAccessAdminRoute("customer_service", "/admin/products"), false);
  assert.equal(canAccessAdminRoute("customer_service", "/api/admin/products"), false);
});
