import type { Actions } from './$types';
import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { db } from '$/lib/server/db';
import { user } from '$/lib/server/db/schema';

export const actions = {
	login: async (event) => {
		const form = await event.request.formData();

		const email = form.get('email');
		const password = form.get('password');

		if (email || password) fail(400, { message: 'missing 1 or more required fields...' });

		try {
			const existingUser = await db.query.user.findFirst({
				where: (user, { eq }) => eq(user.email, email?.toString() ?? '')
			});
			if (!existingUser) {
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}
			const validPassword = await new Argon2id().verify(
				existingUser.hashed_password,
				password?.toString() ?? ''
			);
			if (!validPassword) {
				return fail(400, {
					message: 'Incorrect username or password'
				});
			}

			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (e) {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		redirect(302, '/');
	},
	register: async (event) => {
		const form = await event.request.formData();

		const email = form.get('email');
		const password = form.get('password');

		if (email || password) fail(400, { message: 'missing 1 or more required fields...' });

		const existingUser = await db.query.user.findFirst({
			where: (user, { eq }) => eq(user.email, email?.toString() ?? '')
		});

		if (existingUser) {
			return fail(400, {
				message: 'Account already exist with provided email!'
			});
		}

		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(password?.toString() ?? '');

		await db
			.insert(user)
			.values({ email: email?.toString() ?? '', id: userId, hashed_password: hashedPassword });

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
} satisfies Actions;
