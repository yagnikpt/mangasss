import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';
import * as schema from './schema';
import { building } from '$app/environment';

export const libsqlClient = building ? null : createClient({
	url: env.PROD_DATABASE_URL!,
	authToken: env.TURSO_TOKEN
});

export const db = building ? null : drizzle(libsqlClient!, { schema });
