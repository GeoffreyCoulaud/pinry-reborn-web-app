import type { Pin, PinSearchResult } from '$lib/types';

class PinsStore {
	pins = $state<Pin[]>([]);
	nextCursor = $state<string | null>(null);
	loading = $state(false);
	loadingMore = $state(false);
	error = $state<string | null>(null);

	reset() {
		this.pins = [];
		this.nextCursor = null;
		this.error = null;
	}

	async loadPins(): Promise<void> {
		this.reset();
		this.loading = true;
		try {
			const res = await fetch('/api/pins');
			if (!res.ok) throw new Error();
			const pg = await res.json();
			this.pins = pg.pins;
			this.nextCursor = pg.nextCursor;
		} catch {
			this.error = 'Failed to load pins';
		} finally {
			this.loading = false;
		}
	}

	async loadMorePins(): Promise<void> {
		if (!this.nextCursor || this.loadingMore) return;
		this.loadingMore = true;
		try {
			const res = await fetch(`/api/pins?cursor=${encodeURIComponent(this.nextCursor)}`);
			if (!res.ok) throw new Error();
			const pg = await res.json();
			this.pins = [...this.pins, ...pg.pins];
			this.nextCursor = pg.nextCursor;
		} catch {
			this.error = 'Failed to load more pins';
		} finally {
			this.loadingMore = false;
		}
	}

	async createPin(body: {
		sourceMediaUrl: string;
		sourceContextUrl?: string;
		description: string;
	}): Promise<Pin> {
		const res = await fetch('/api/pins', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (!res.ok) throw new Error('Failed to create pin');
		const pin: Pin = await res.json();
		this.pins = [pin, ...this.pins];
		return pin;
	}

	async updateTags(pinId: string, tags: string[]): Promise<Pin> {
		const prev = this.pins;
		this.pins = this.pins.map((p) =>
			p.id === pinId ? { ...p, tags: tags.map((name) => ({ name })) } : p
		);
		try {
			const res = await fetch(`/api/pins/${pinId}/tags`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ tags })
			});
			if (!res.ok) throw new Error();
			const updated: Pin = await res.json();
			this.pins = this.pins.map((p) => (p.id === pinId ? updated : p));
			return updated;
		} catch {
			this.pins = prev;
			throw new Error('Failed to update tags');
		}
	}

	async softDeletePin(pinId: string): Promise<void> {
		const prev = this.pins;
		this.pins = this.pins.filter((p) => p.id !== pinId);
		const res = await fetch(`/api/pins/${pinId}`, { method: 'DELETE' });
		if (!res.ok) {
			this.pins = prev;
			throw new Error('Failed to delete pin');
		}
	}

	async search(query: string): Promise<void> {
		this.reset();
		if (!query.trim()) return;
		this.loading = true;
		try {
			const res = await fetch(`/api/search/pins?q=${encodeURIComponent(query)}`);
			if (!res.ok) throw new Error();
			const data = await res.json();
			this.pins = (data.results as PinSearchResult[]).map((r) => r.pin);
		} catch {
			this.error = 'Failed to search';
		} finally {
			this.loading = false;
		}
	}

	async loadRecycled(): Promise<void> {
		this.reset();
		this.loading = true;
		try {
			const res = await fetch('/api/pins/recycled');
			if (!res.ok) throw new Error();
			const pg = await res.json();
			this.pins = pg.pins;
			this.nextCursor = pg.nextCursor;
		} catch {
			this.error = 'Failed to load recycle bin';
		} finally {
			this.loading = false;
		}
	}

	async loadMoreRecycled(): Promise<void> {
		if (!this.nextCursor || this.loadingMore) return;
		this.loadingMore = true;
		try {
			const res = await fetch(`/api/pins/recycled?cursor=${encodeURIComponent(this.nextCursor)}`);
			if (!res.ok) throw new Error();
			const pg = await res.json();
			this.pins = [...this.pins, ...pg.pins];
			this.nextCursor = pg.nextCursor;
		} catch {
			this.error = 'Failed to load more pins';
		} finally {
			this.loadingMore = false;
		}
	}

	async restorePin(pinId: string): Promise<void> {
		const prev = this.pins;
		this.pins = this.pins.filter((p) => p.id !== pinId);
		const res = await fetch(`/api/pins/recycled/${pinId}/restore`, { method: 'POST' });
		if (!res.ok) {
			this.pins = prev;
			throw new Error('Failed to restore pin');
		}
	}

	async permanentlyDeletePin(pinId: string): Promise<void> {
		const prev = this.pins;
		this.pins = this.pins.filter((p) => p.id !== pinId);
		const res = await fetch(`/api/pins/recycled/${pinId}`, { method: 'DELETE' });
		if (!res.ok) {
			this.pins = prev;
			throw new Error('Failed to permanently delete pin');
		}
	}

	async emptyRecycleBin(): Promise<void> {
		const prev = { pins: this.pins, cursor: this.nextCursor };
		this.pins = [];
		this.nextCursor = null;
		const res = await fetch('/api/pins/recycled', { method: 'DELETE' });
		if (!res.ok) {
			this.pins = prev.pins;
			this.nextCursor = prev.cursor;
			throw new Error('Failed to empty recycle bin');
		}
	}
}

export const pinsStore = new PinsStore();