import { json } from '@sveltejs/kit';
import { restorePin } from '$lib/server/pins.js';
import type { RequestHandler } from './$types.js';

export const POST: RequestHandler = async ({ params, locals }) => {
	const pin = await restorePin(locals.credentials, params.pinId);
	return json(pin);
};
