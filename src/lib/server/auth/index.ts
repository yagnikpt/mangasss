import { Lucia } from 'lucia';
import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import { libsqlClient } from '../db';
import { dev } from '$app/environment';
import type { LibraryRead } from '$/lib';

export const lucia = new Lucia(
	new LibSQLAdapter(libsqlClient, {
		user: 'user',
		session: 'session'
	}),
	{
		sessionCookie: {
			attributes: {
				secure: !dev
			}
		},
		getUserAttributes: (attributes) => {
			return {
				// attributes has the type of DatabaseUserAttributes
				id: attributes.id,
				name: attributes.name,
				reads: attributes.reads
			};
		}
	}
);

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	id: string;
	name: string;
	reads: LibraryRead[];
}
