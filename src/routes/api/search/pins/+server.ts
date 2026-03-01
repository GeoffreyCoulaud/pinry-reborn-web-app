import { json } from '@sveltejs/kit';
import { searchPins } from '$lib/server/pins.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ url, locals }) => {
	const q = url.searchParams.get('q') ?? '';
	const limit = Number(url.searchParams.get('limit')) || undefined;

	if (!q.trim()) return json({ results: [] });

	const results = await searchPins(locals.credentials, q, limit);
	return json({ results });
};
