/**
 * Store layer — Svelte 5 runes for reactive state.
 *
 * Rules:
 *  - Use .svelte.ts extension so runes ($state, $derived) work.
 *  - Orchestrate by calling services/ and api/ — no inline business logic.
 *  - Never import from components/.
 */

import type { Pin } from '$lib/types';
import { filterPinsWithDescription } from '$lib/services/example.service';

// --- Reactive state ---
let pins = $state<Pin[]>([]);
let loading = $state(false);

// --- Derived values ---
const pinsWithDescription = $derived(filterPinsWithDescription(pins));
const count = $derived(pins.length);

// --- Actions ---
function setPins(next: Pin[]) {
	pins = next;
}

function setLoading(next: boolean) {
	loading = next;
}

// Export a single object so consumers have a clear API surface.
export const pinStore = {
	get pins() {
		return pins;
	},
	get pinsWithDescription() {
		return pinsWithDescription;
	},
	get count() {
		return count;
	},
	get loading() {
		return loading;
	},
	setPins,
	setLoading
};
