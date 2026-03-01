import { json } from '@sveltejs/kit';
import { fetchPins, createPin } from '$lib/server/pins.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ url, locals }) => {
	const cursor = url.searchParams.get('cursor') ?? undefined;
	const page = await fetchPins(locals.credentials, {
		cursor,
		sort: 'CREATED_AT_DESC'
	});

	return json({
		pins: page.pins,
		nextCursor: page.pagination.nextCursor
	});
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json();
	const pin = await createPin(locals.credentials, body);
	return json(pin, { status: 201 });
};
