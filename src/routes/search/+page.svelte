<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import PinCard from '$lib/components/PinCard.svelte';
	import PinDetailDialog from '$lib/components/PinDetailDialog.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import type { Pin } from '$lib/types';

	let { data } = $props();
	let modalOpen = $state(true);

	function handlePinClick(pin: Pin) {
		modalOpen = true;
		pushState(`/pins/${pin.id}`, { showPinModal: true, pin });
	}

	function handleModalClose() {
		history.back();
	}
</script>

{#if data.results.length === 0}
	<p class="py-12 text-center text-text-muted">{m.search_no_results()}</p>
{:else}
	<div class="masonry">
		{#each data.results as pin (pin.id)}
			<PinCard {pin} onclick={() => handlePinClick(pin)} />
		{/each}
	</div>
{/if}

{#if $page.state.showPinModal && $page.state.pin}
	<PinDetailDialog pin={$page.state.pin} bind:open={modalOpen} onclose={handleModalClose} />
{/if}
