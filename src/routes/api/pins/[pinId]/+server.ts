import { softDeletePin } from '$lib/server/pins.js';
import type { RequestHandler } from './$types.js';

export const DELETE: RequestHandler = async ({ params, locals }) => {
	await softDeletePin(locals.credentials, params.pinId);
	return new Response(null, { status: 204 });
};
