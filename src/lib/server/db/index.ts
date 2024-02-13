import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

// NOTE: in production this should obviously be replaced with a turso instance
export const libsqlClient = createClient({
	url: env.PROD_DATABASE_URL
});

export const db = drizzle(libsqlClient, { schema });
