import { describe, it, expect } from 'vitest';
import { filterPinsWithDescription, formatPinTitle } from './example.service';
import type { Pin } from '$lib/types';

describe('filterPinsWithDescription', () => {
	it('keeps only pins that have a non-empty description', () => {
		const pins: Pin[] = [
			{ id: '1', title: 'A', imageUrl: '', description: 'Has one' },
			{ id: '2', title: 'B', imageUrl: '' },
			{ id: '3', title: 'C', imageUrl: '', description: '' }
		];
		expect(filterPinsWithDescription(pins)).toEqual([pins[0]]);
	});
});

describe('formatPinTitle', () => {
	it('returns the trimmed title', () => {
		const pin: Pin = { id: '1', title: '  Hello  ', imageUrl: '' };
		expect(formatPinTitle(pin)).toBe('Hello');
	});

	it('returns fallback for empty title', () => {
		const pin: Pin = { id: '1', title: '', imageUrl: '' };
		expect(formatPinTitle(pin)).toBe('Untitled Pin');
	});
});
