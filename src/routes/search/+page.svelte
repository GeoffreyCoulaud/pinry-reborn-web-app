<script lang="ts">
	import { onMount } from 'svelte';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import PinCard from '$lib/components/PinCard.svelte';
	import PinDetailDialog from '$lib/components/PinDetailDialog.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { pinsStore } from '$lib/stores/pins.svelte.js';

	let modalOpen = $state(true);

	function handlePinClick(pinId: string) {
		const pin = pinsStore.pins.find((p) => p.id === pinId);
		if (!pin) return;
		modalOpen = true;
		pushState(`/pins/${pin.id}`, { showPinModal: true, pin });
	}

	function handleModalClose() {
		history.back();
	}

	onMount(() => {
		const q = $page.url.searchParams.get('q') ?? '';
		pinsStore.search(q);
	});
</script>

{#if pinsStore.loading}
	<p class="py-12 text-center text-text-muted">{m.loading_more()}</p>
{:else if pinsStore.pins.length === 0}
	<p class="py-12 text-center text-text-muted">{m.search_no_results()}</p>
{:else}
	<div class="masonry">
		{#each pinsStore.pins as pin (pin.id)}
			<PinCard {pin} onclick={() => handlePinClick(pin.id)} />
		{/each}
	</div>
{/if}

{#if $page.state.showPinModal && $page.state.pin}
	<PinDetailDialog pin={$page.state.pin} bind:open={modalOpen} onclose={handleModalClose} />
{/if}
