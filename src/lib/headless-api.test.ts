import assert from 'node:assert/strict';
import test from 'node:test';
import { hashApiKeySecret } from './developer-api-keys.ts';
import {
  parseDomainPattern,
  matchOriginAgainstPattern,
  isOriginAllowed,
  validateHeadlessRequest,
  headlessOk,
  headlessError,
  getRequestOrigin,
} from './headless-api.ts';

test('parseDomainPattern parses wildcard and exact domain patterns', () => {
  assert.deepEqual(parseDomainPattern('*'), { raw: '*', host: '*', isWildcardSubdomain: false });
  assert.equal(parseDomainPattern('https://example.com')?.host, 'example.com');
  assert.equal(parseDomainPattern('*.example.com')?.isWildcardSubdomain, true);
  assert.equal(parseDomainPattern('*.example.com')?.host, 'example.com');
  assert.equal(parseDomainPattern('https://*.example.com')?.isWildcardSubdomain, true);
  assert.equal(parseDomainPattern('localhost')?.host, 'localhost');
});

test('matchOriginAgainstPattern correctly matches origins and subdomains', () => {
  // Wildcard open
  assert.equal(matchOriginAgainstPattern('https://any-domain.com', '*'), true);

  // Exact domain
  assert.equal(matchOriginAgainstPattern('https://permatamall.shop', 'permatamall.shop'), true);
  assert.equal(matchOriginAgainstPattern('https://permatamall.shop', 'https://permatamall.shop'), true);
  assert.equal(matchOriginAgainstPattern('https://other.com', 'permatamall.shop'), false);

  // Wildcard subdomain matching
  assert.equal(matchOriginAgainstPattern('https://app.permatamall.shop', '*.permatamall.shop'), true);
  assert.equal(matchOriginAgainstPattern('https://store.dev.permatamall.shop', '*.permatamall.shop'), true);
  assert.equal(matchOriginAgainstPattern('https://permatamall.shop', '*.permatamall.shop'), true);

  // Reject domain prefix spoofing (e.g. evil-permatamall.shop should NOT match *.permatamall.shop)
  assert.equal(matchOriginAgainstPattern('https://evil-permatamall.shop', '*.permatamall.shop'), false);

  // Local development
  assert.equal(matchOriginAgainstPattern('http://localhost:3000', 'localhost'), true);
  assert.equal(matchOriginAgainstPattern('http://127.0.0.1:5173', '127.0.0.1'), true);
});

test('isOriginAllowed permits valid origins and server-side calls without Origin header', () => {
  const allowedPatterns = ['permatamall.shop', '*.mybrand.com', 'localhost'];

  // Server-to-server / cURL / native mobile apps (no Origin header) -> allowed
  assert.equal(isOriginAllowed(null, allowedPatterns), true);

  // Allowed domain
  assert.equal(isOriginAllowed('https://permatamall.shop', allowedPatterns), true);
  assert.equal(isOriginAllowed('https://shop.mybrand.com', allowedPatterns), true);
  assert.equal(isOriginAllowed('http://localhost:4321', allowedPatterns), true);

  // Unauthorized domain -> rejected
  assert.equal(isOriginAllowed('https://unauthorized-hacker.com', allowedPatterns), false);
});

test('getRequestOrigin extracts origin from Origin or Referer header', () => {
  const req1 = new Request('https://api.permatamall.shop/api/v1/storefront', {
    headers: { origin: 'https://myfront.com' },
  });
  assert.equal(getRequestOrigin(req1), 'https://myfront.com');

  const req2 = new Request('https://api.permatamall.shop/api/v1/storefront', {
    headers: { referer: 'https://referrer-site.com/checkout' },
  });
  assert.equal(getRequestOrigin(req2), 'https://referrer-site.com');
});

test('validateHeadlessRequest returns 403 response for forbidden origin', async () => {
  const secret = 'cmsads_live_forbidden_origin_test_key';
  const keyHash = await hashApiKeySecret(secret);
  const req = new Request('https://api.permatamall.shop/api/v1/storefront', {
    headers: {
      origin: 'https://unauthorized-domain.com',
      'x-app-key': secret,
    },
  });
  const locals = {
    runtimeEnv: {
      OMS_DB: {
        prepare(query: string) {
          return {
            bind() {
              if (query.includes('SELECT id, key_hash')) {
                return {
                  async first() {
                    return { id: 7, key_hash: keyHash };
                  },
                };
              }
              return {
                async run() {
                  return { success: true };
                },
              };
            },
          };
        },
      },
    },
  } as unknown as App.Locals;

  const res = await validateHeadlessRequest(req, locals, ['https://my-authorized-app.com']);
  assert.equal(res.allowed, false);
  assert.notEqual(res.errorResponse, undefined);
  assert.equal(res.errorResponse?.status, 403);
});

test('validateHeadlessRequest rejects missing API keys before origin-only access', async () => {
  const req = new Request('https://api.permatamall.shop/api/v1/storefront');
  const res = await validateHeadlessRequest(req);
  assert.equal(res.allowed, false);
  assert.equal(res.errorResponse?.status, 401);
  const json = (await res.errorResponse?.json()) as { error?: { code?: string } };
  assert.equal(json.error?.code, 'API_KEY_REQUIRED');
});

test('headlessOk returns proper JSON structure and status', async () => {
  const res = headlessOk({ test_data: 'hello' }, 200);
  assert.equal(res.status, 200);
  const json = (await res.json()) as { success: boolean; test_data: string };
  assert.equal(json.success, true);
  assert.equal(json.test_data, 'hello');
});

test('headlessError returns proper error payload structure', async () => {
  const res = headlessError('Invalid request parameters', 400, { code: 'TEST_ERROR' });
  assert.equal(res.status, 400);
  const json = (await res.json()) as { success: boolean; error: { message: string; code: string } };
  assert.equal(json.success, false);
  assert.equal(json.error.message, 'Invalid request parameters');
  assert.equal(json.error.code, 'TEST_ERROR');
});
