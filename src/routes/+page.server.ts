import { fetchPins } from '$lib/server/pins.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const page = await fetchPins(locals.credentials, {
			sort: 'CREATED_AT_DESC'
		});

		return {
			pins: page.pins,
			nextCursor: page.pagination.nextCursor
		};
	} catch (e) {
		console.error('Failed to load pins:', e);
		return {
			pins: [],
			nextCursor: null
		};
	}
};
