import { json } from '@sveltejs/kit';
import { fetchRecycledPins, emptyRecycleBin } from '$lib/server/pins.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ url, locals }) => {
	const cursor = url.searchParams.get('cursor') ?? undefined;
	const page = await fetchRecycledPins(locals.credentials, {
		cursor,
		sort: 'DELETED_AT_DESC'
	});

	return json({
		pins: page.pins,
		nextCursor: page.pagination.nextCursor
	});
};

export const DELETE: RequestHandler = async ({ locals }) => {
	await emptyRecycleBin(locals.credentials);
	return new Response(null, { status: 204 });
};
