import { fetchRecycledPins } from '$lib/server/pins.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const page = await fetchRecycledPins(locals.credentials, {
			sort: 'DELETED_AT_DESC'
		});

		return {
			pins: page.pins,
			nextCursor: page.pagination.nextCursor
		};
	} catch (e) {
		console.error('Failed to load recycled pins:', e);
		return {
			pins: [],
			nextCursor: null
		};
	}
};
