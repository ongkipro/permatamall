import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function getDb(envD1?: D1Database) {
  if (!envD1) {
    throw new Error('Cloudflare D1 Database binding (OMS_DB) is not available');
  }
  return drizzle(envD1, { schema });
}
