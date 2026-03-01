import { fail, redirect } from '@sveltejs/kit';
import { setAuthCookie } from '$lib/server/auth.js';
import { apiFetch, apiPublicFetch } from '$lib/server/api.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString().trim() ?? '';
		const password = data.get('password')?.toString() ?? '';

		if (!username || !password) {
			return fail(400, { error: 'missing_fields', username });
		}

		const credentials = btoa(`${username}:${password}`);

		try {
			const response = await apiFetch('/api/v1/pins', credentials);

			if (response.status === 401) {
				return fail(401, { error: 'invalid_credentials', username });
			}

			if (!response.ok) {
				return fail(500, { error: 'server_error', username });
			}
		} catch (e) {
			console.error('Login failed:', e);
			return fail(500, { error: 'server_error', username });
		}

		setAuthCookie(cookies, credentials);
		redirect(303, '/');
	},

	signup: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString().trim() ?? '';
		const password = data.get('password')?.toString() ?? '';

		if (!username || !password) {
			return fail(400, { error: 'missing_fields', username });
		}

		try {
			const response = await apiPublicFetch('/api/v1/users', {
				method: 'POST',
				body: JSON.stringify({ name: username, password })
			});

			if (response.status === 500) {
				return fail(409, { error: 'username_taken', username });
			}

			if (!response.ok) {
				return fail(500, { error: 'server_error', username });
			}
		} catch (e) {
			console.error('Signup failed:', e);
			return fail(500, { error: 'server_error', username });
		}

		const credentials = btoa(`${username}:${password}`);
		setAuthCookie(cookies, credentials);
		redirect(303, '/');
	}
};
