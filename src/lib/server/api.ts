import { getApiBaseUrl } from './env.js';

export async function apiFetch(
	path: string,
	credentials: string,
	options?: RequestInit
): Promise<Response> {
	const baseUrl = getApiBaseUrl();
	return fetch(`${baseUrl}${path}`, {
		...options,
		headers: {
			Authorization: `Basic ${credentials}`,
			'Content-Type': 'application/json',
			...options?.headers
		}
	});
}

export async function apiPublicFetch(path: string, options?: RequestInit): Promise<Response> {
	const baseUrl = getApiBaseUrl();
	return fetch(`${baseUrl}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options?.headers
		}
	});
}
