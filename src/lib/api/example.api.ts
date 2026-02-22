/**
 * API layer — HTTP calls only, no business logic.
 *
 * Rules:
 *  - Never import from services/ or stores/.
 *  - Return typed responses; throw on non-OK status.
 */

import type { Pin } from '$lib/types';

const BASE = '/api'; // replace with your real base URL

/** Fetch a single pin by ID. */
export async function fetchPin(id: string): Promise<Pin> {
	const res = await fetch(`${BASE}/pins/${id}`);
	if (!res.ok) throw new Error(`Failed to fetch pin ${id}`);
	return res.json();
}

/** Fetch all pins. */
export async function fetchPins(): Promise<Pin[]> {
	const res = await fetch(`${BASE}/pins`);
	if (!res.ok) throw new Error('Failed to fetch pins');
	return res.json();
}
