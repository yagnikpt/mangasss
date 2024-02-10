import { db } from '$/lib/server/db';
import { user } from '$/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import type { LibraryRead } from '$/lib';

export const POST: RequestHandler = async ({ request, locals }) => {
	const reads: LibraryRead[] = await request.json();

	if (reads && locals.user)
		await db
			.update(user)
			.set({ reads })
			.where(eq(user.id, locals.user?.id ?? ''));

	return new Response('OK', { status: 200 });
};
