import { json } from '@sveltejs/kit';
import { setTags } from '$lib/server/pins.js';
import type { RequestHandler } from './$types.js';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const { tags } = await request.json();
	const pin = await setTags(locals.credentials, params.pinId, tags);
	return json(pin);
};
