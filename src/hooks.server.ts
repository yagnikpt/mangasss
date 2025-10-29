import { lucia } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import {
	httpRequestCounter,
	httpRequestDurationMicroseconds,
} from "$lib/server/metrics";

export const monitoring: Handle = async ({ event, resolve }) => {
	const start = Date.now();
	const response = await resolve(event);

	if (event.url.pathname === "/metrics") {
		return response;
	}

	const duration = Date.now() - start;

	httpRequestCounter.inc({
		method: event.request.method,
		route: event.url.pathname,
		status: response.status,
	});
	
	httpRequestDurationMicroseconds.observe(
		{
			method: event.request.method,
			route: event.url.pathname,
			status: response.status,
		},
		duration,
	);

	return response;
};

export const auth: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	const { session, user } = await lucia.validateSession(sessionId);
	if (session?.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes,
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes,
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

export const handle = sequence(monitoring, auth);
