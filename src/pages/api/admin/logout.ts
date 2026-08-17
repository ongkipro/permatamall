import type { APIRoute } from 'astro';
import { ADMIN_SESSION_COOKIE_OPTIONS, SESSION_COOKIE_NAME, getAdminSessionKey, getSessionCookie, verifyJwt } from '../../../lib/auth';
import { getEnvValue, getRuntimeEnv } from '../../../lib/env';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, cookies, redirect }) => {
  const env = getRuntimeEnv(locals);
  const sessions = env?.SESSION as KVNamespace | undefined;
  const token = getSessionCookie(request);
  const session = token ? await verifyJwt(token, getEnvValue('AUTH_SECRET', env)) : null;

  if (sessions && session) {
    await sessions.delete(getAdminSessionKey(session));
  }
  cookies.delete(SESSION_COOKIE_NAME, ADMIN_SESSION_COOKIE_OPTIONS);
  return redirect('/hello', 303);
};
