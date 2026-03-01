import { searchPins } from '$lib/server/pins.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ url, locals }) => {
	const q = url.searchParams.get('q') ?? '';

	if (!q.trim()) {
		return { query: '', results: [] };
	}

	const results = await searchPins(locals.credentials, q);
	return {
		query: q,
		results: results.map((r) => r.pin)
	};
};
