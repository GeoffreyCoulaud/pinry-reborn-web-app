<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';
	import RecycledPinCard from '$lib/components/RecycledPinCard.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import { pinsStore } from '$lib/stores/pins.svelte.js';
	import type { Pin } from '$lib/types';

	let sentinel: HTMLDivElement | undefined = $state(undefined);
	let confirmDeleteOpen = $state(false);
	let pinToDelete: Pin | null = $state(null);
	let confirmEmptyOpen = $state(false);

	async function handleRestore(pin: Pin) {
		try {
			await pinsStore.restorePin(pin.id);
			toast.success(m.bin_restored());
		} catch {
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
		try {
			await pinsStore.permanentlyDeletePin(pin.id);
			toast.success(m.bin_deleted_forever());
		} catch {
			toast.error(m.bin_delete_error());
		}
	}

	async function handleEmptyBin() {
		confirmEmptyOpen = false;
		try {
			await pinsStore.emptyRecycleBin();
			toast.success(m.bin_emptied());
		} catch {
			toast.error(m.bin_empty_error());
		}
	}

	onMount(() => {
		pinsStore.loadRecycled();

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) pinsStore.loadMoreRecycled();
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
	{#if pinsStore.pins.length > 0}
		<button
			type="button"
			onclick={() => (confirmEmptyOpen = true)}
			class="rounded border border-red-600 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white"
		>
			{m.bin_empty()}
		</button>
	{/if}
</div>

{#if pinsStore.loading}
	<p class="py-12 text-center text-text-muted">{m.loading_more()}</p>
{:else if pinsStore.pins.length === 0}
	<p class="py-12 text-center text-text-muted">{m.bin_no_pins()}</p>
{:else}
	<div class="masonry">
		{#each pinsStore.pins as pin (pin.id)}
			<RecycledPinCard
				{pin}
				onrestore={() => handleRestore(pin)}
				ondelete={() => requestDelete(pin)}
			/>
		{/each}
	</div>

	{#if pinsStore.nextCursor}
		<div bind:this={sentinel} class="py-8 text-center text-sm text-text-subtle">
			{#if pinsStore.loadingMore}
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
