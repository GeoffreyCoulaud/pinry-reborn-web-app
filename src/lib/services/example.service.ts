/**
 * Service layer — pure TypeScript functions, no Svelte imports.
 *
 * Rules:
 *  - No Svelte imports allowed (no runes, no stores, no components).
 *  - May import from types/ and api/.
 *  - Keep functions pure: same input → same output.
 */

import type { Pin } from '$lib/types';
import { m } from '$lib/paraglide/messages.js';

/** Return only pins that have a description. */
export function filterPinsWithDescription(pins: Pin[]): Pin[] {
	return pins.filter((pin) => pin.description && pin.description.trim().length > 0);
}

/** Build a display title from a pin. */
export function formatPinTitle(pin: Pin): string {
	return pin.title.trim() || m.pin_untitled();
}
