import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	driver: 'turso',
	dbCredentials: {
		url: process.env.PROD_DATABASE_URL!,
		authToken: process.env.TURSO_TOKEN!
	}
} satisfies Config;
