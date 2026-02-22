import { env } from '$env/dynamic/private';

export function getApiBaseUrl(): string {
	const url = env.API_BASE_URL;
	if (!url) {
		throw new Error('API_BASE_URL environment variable is not set');
	}
	return url;
}
