import { fetchPin } from '$lib/server/pins.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const pin = await fetchPin(locals.credentials, params.pinId);
	return { pin };
};
