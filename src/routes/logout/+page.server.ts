import { redirect } from '@sveltejs/kit';
import { clearAuthCookie } from '$lib/server/auth.js';
import type { Actions } from './$types.js';

export const actions: Actions = {
	default: async ({ cookies }) => {
		clearAuthCookie(cookies);
		redirect(303, '/login');
	}
};
