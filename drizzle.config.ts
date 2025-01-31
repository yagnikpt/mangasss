import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'turso',
	verbose: true,
	strict: true,
	dbCredentials: {
		url: process.env.PROD_DATABASE_URL!,
		authToken: process.env.TURSO_TOKEN!
	}
});
