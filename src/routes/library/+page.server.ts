import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$/lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		const res = await db.query.user.findFirst({
			columns: {
				reads: true
			},
			where: (user, { eq }) => eq(user.id, locals.user?.id ?? '')
		});
		if (res) return res;
	}
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/');
	}
};
