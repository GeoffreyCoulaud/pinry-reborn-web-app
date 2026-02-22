import { redirect, type Handle } from '@sveltejs/kit';
import { getAuthCookie, decodeUsername } from '$lib/server/auth.js';

export const handle: Handle = async ({ event, resolve }) => {
	const credentials = getAuthCookie(event.cookies);
	const isLoginPage = event.url.pathname === '/login';

	if (credentials) {
		event.locals.credentials = credentials;
		event.locals.username = decodeUsername(credentials);

		if (isLoginPage) {
			redirect(303, '/');
		}
	} else if (!isLoginPage) {
		redirect(303, '/login');
	}

	return resolve(event);
};
