import { apiFetch } from './api.js';
import type { Pin, PinPage, PinSearchResult, TagSearchResult } from '$lib/types';

interface FetchPinsOptions {
	cursor?: string;
	pageSize?: number;
	sort?: 'CREATED_AT_ASC' | 'CREATED_AT_DESC';
}

export async function fetchPins(
	credentials: string,
	opts?: FetchPinsOptions
): Promise<PinPage> {
	const params = new URLSearchParams();
	if (opts?.cursor) params.set('cursor', opts.cursor);
	if (opts?.pageSize) params.set('pageSize', String(opts.pageSize));
	if (opts?.sort) params.set('sort', opts.sort);

	const query = params.toString();
	const path = `/api/v1/pins${query ? `?${query}` : ''}`;
	const res = await apiFetch(path, credentials);

	if (!res.ok) throw new Error(`Failed to fetch pins: ${res.status}`);
	return res.json();
}

export async function fetchPin(credentials: string, pinId: string): Promise<Pin> {
	const res = await apiFetch(`/api/v1/pins/${pinId}`, credentials);
	if (!res.ok) throw new Error(`Failed to fetch pin ${pinId}: ${res.status}`);
	return res.json();
}

export async function createPin(
	credentials: string,
	body: { sourceContextUrl?: string; sourceMediaUrl: string; description?: string }
): Promise<Pin> {
	const res = await apiFetch('/api/v1/pins', credentials, {
		method: 'POST',
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new Error(`Failed to create pin: ${res.status}`);
	return res.json();
}

export async function setTags(
	credentials: string,
	pinId: string,
	tags: string[]
): Promise<Pin> {
	const res = await apiFetch(`/api/v1/pins/${pinId}/tags`, credentials, {
		method: 'PUT',
		body: JSON.stringify({ tags })
	});
	if (!res.ok) throw new Error(`Failed to set tags: ${res.status}`);
	return res.json();
}

export async function searchPins(
	credentials: string,
	query: string,
	limit?: number
): Promise<PinSearchResult[]> {
	const params = new URLSearchParams({ q: query });
	if (limit) params.set('limit', String(limit));

	const res = await apiFetch(`/api/v1/pins/search?${params}`, credentials);
	if (!res.ok) throw new Error(`Failed to search pins: ${res.status}`);
	const data = await res.json();
	return data.results;
}

export async function searchTags(
	credentials: string,
	query: string,
	limit?: number
): Promise<TagSearchResult[]> {
	const params = new URLSearchParams({ q: query });
	if (limit) params.set('limit', String(limit));

	const res = await apiFetch(`/api/v1/tags/search?${params}`, credentials);
	if (!res.ok) throw new Error(`Failed to search tags: ${res.status}`);
	const data = await res.json();
	return data.results;
}
