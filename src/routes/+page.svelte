<script lang="ts">
	import { onMount } from 'svelte';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import PinCard from '$lib/components/PinCard.svelte';
	import PinDetailDialog from '$lib/components/PinDetailDialog.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import type { Pin } from '$lib/types';

	let { data } = $props();

	let extraPins: Pin[] = $state([]);
	let cursorOverride: string | null | undefined = $state(undefined);
	let loadingMore = $state(false);

	const nextCursor = $derived(cursorOverride !== undefined ? cursorOverride : data.nextCursor);
	let sentinel: HTMLDivElement | undefined = $state(undefined);
	let modalOpen = $state(true);

	const pins = $derived([...extraPins, ...data.pins]);

	async function loadMore() {
		if (!nextCursor || loadingMore) return;
		loadingMore = true;
		try {
			const res = await fetch(`/api/pins?cursor=${encodeURIComponent(nextCursor)}`);
			if (!res.ok) return;
			const pg = await res.json();
			// Append to the server data by pushing newly created pins + server data + loaded data
			// We need to track cursor-loaded pins separately
			data.pins = [...data.pins, ...pg.pins];
			cursorOverride = pg.nextCursor;
		} finally {
			loadingMore = false;
		}
	}

	function handlePinClick(pin: Pin) {
		modalOpen = true;
		pushState(`/pins/${pin.id}`, { showPinModal: true, pin });
	}

	function handleModalClose() {
		history.back();
	}

	function handlePinCreated(e: Event) {
		const pin = (e as CustomEvent<Pin>).detail;
		extraPins = [pin, ...extraPins];
	}

	onMount(() => {
		window.addEventListener('pin-created', handlePinCreated);

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

		return () => {
			window.removeEventListener('pin-created', handlePinCreated);
			observer.disconnect();
		};
	});
</script>

{#if pins.length === 0}
	<p class="py-12 text-center text-text-muted">{m.pin_no_pins()}</p>
{:else}
	<div class="masonry">
		{#each pins as pin (pin.id)}
			<PinCard {pin} onclick={() => handlePinClick(pin)} />
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

{#if $page.state.showPinModal && $page.state.pin}
	<PinDetailDialog pin={$page.state.pin} bind:open={modalOpen} onclose={handleModalClose} />
{/if}
