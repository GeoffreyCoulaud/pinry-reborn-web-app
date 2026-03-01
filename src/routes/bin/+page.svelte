<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';
	import RecycledPinCard from '$lib/components/RecycledPinCard.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import type { Pin } from '$lib/types';

	let { data } = $props();

	let loadingMore = $state(false);
	let cursorOverride: string | null | undefined = $state(undefined);
	let sentinel: HTMLDivElement | undefined = $state(undefined);

	const nextCursor = $derived(cursorOverride !== undefined ? cursorOverride : data.nextCursor);

	// Confirm dialog state for single pin delete
	let confirmDeleteOpen = $state(false);
	let pinToDelete: Pin | null = $state(null);

	// Confirm dialog state for empty bin
	let confirmEmptyOpen = $state(false);

	async function loadMore() {
		if (!nextCursor || loadingMore) return;
		loadingMore = true;
		try {
			const res = await fetch(`/api/pins/recycled?cursor=${encodeURIComponent(nextCursor)}`);
			if (!res.ok) return;
			const pg = await res.json();
			data.pins = [...data.pins, ...pg.pins];
			cursorOverride = pg.nextCursor;
		} finally {
			loadingMore = false;
		}
	}

	async function handleRestore(pin: Pin) {
		const prev = data.pins;
		data.pins = data.pins.filter((p) => p.id !== pin.id);

		try {
			const res = await fetch(`/api/pins/recycled/${pin.id}/restore`, { method: 'POST' });
			if (!res.ok) throw new Error();
			toast.success(m.bin_restored());
		} catch {
			data.pins = prev;
			toast.error(m.bin_restore_error());
		}
	}

	function requestDelete(pin: Pin) {
		pinToDelete = pin;
		confirmDeleteOpen = true;
	}

	async function handlePermanentDelete() {
		if (!pinToDelete) return;
		const pin = pinToDelete;
		confirmDeleteOpen = false;
		pinToDelete = null;

		const prev = data.pins;
		data.pins = data.pins.filter((p) => p.id !== pin.id);

		try {
			const res = await fetch(`/api/pins/recycled/${pin.id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error();
			toast.success(m.bin_deleted_forever());
		} catch {
			data.pins = prev;
			toast.error(m.bin_delete_error());
		}
	}

	async function handleEmptyBin() {
		confirmEmptyOpen = false;
		const prev = data.pins;
		data.pins = [];
		cursorOverride = null;

		try {
			const res = await fetch('/api/pins/recycled', { method: 'DELETE' });
			if (!res.ok) throw new Error();
			toast.success(m.bin_emptied());
		} catch {
			data.pins = prev;
			cursorOverride = undefined;
			toast.error(m.bin_empty_error());
		}
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadMore();
			},
			{ rootMargin: '200px' }
		);

		$effect(() => {
			if (sentinel) {
				observer.observe(sentinel);
				return () => observer.unobserve(sentinel!);
			}
		});

		return () => observer.disconnect();
	});
</script>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-semibold">{m.bin_title()}</h1>
	{#if data.pins.length > 0}
		<button
			type="button"
			onclick={() => (confirmEmptyOpen = true)}
			class="rounded border border-red-600 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white"
		>
			{m.bin_empty()}
		</button>
	{/if}
</div>

{#if data.pins.length === 0}
	<p class="py-12 text-center text-text-muted">{m.bin_no_pins()}</p>
{:else}
	<div class="masonry">
		{#each data.pins as pin (pin.id)}
			<RecycledPinCard
				{pin}
				onrestore={() => handleRestore(pin)}
				ondelete={() => requestDelete(pin)}
			/>
		{/each}
	</div>

	{#if nextCursor}
		<div bind:this={sentinel} class="py-8 text-center text-sm text-text-subtle">
			{#if loadingMore}
				{m.loading_more()}
			{/if}
		</div>
	{/if}
{/if}

<ConfirmDialog
	bind:open={confirmDeleteOpen}
	title={m.bin_confirm_delete_title()}
	description={m.bin_confirm_delete_desc()}
	confirmLabel={m.bin_delete_forever()}
	onconfirm={handlePermanentDelete}
/>

<ConfirmDialog
	bind:open={confirmEmptyOpen}
	title={m.bin_confirm_empty_title()}
	description={m.bin_confirm_empty_desc()}
	confirmLabel={m.bin_empty()}
	onconfirm={handleEmptyBin}
/>
