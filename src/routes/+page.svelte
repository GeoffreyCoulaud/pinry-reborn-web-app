<script lang="ts">
	import { onMount } from 'svelte';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import PinCard from '$lib/components/PinCard.svelte';
	import PinDetailDialog from '$lib/components/PinDetailDialog.svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { pinsStore } from '$lib/stores/pins.svelte.js';

	let modalOpen = $state(true);
	let sentinel: HTMLDivElement | undefined = $state(undefined);

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
		pinsStore.loadPins();

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) pinsStore.loadMorePins();
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

{#if pinsStore.loading}
	<p class="py-12 text-center text-text-muted">{m.loading_more()}</p>
{:else if pinsStore.pins.length === 0}
	<p class="py-12 text-center text-text-muted">{m.pin_no_pins()}</p>
{:else}
	<div class="masonry">
		{#each pinsStore.pins as pin (pin.id)}
			<PinCard {pin} onclick={() => handlePinClick(pin.id)} />
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

{#if $page.state.showPinModal && $page.state.pin}
	<PinDetailDialog pin={$page.state.pin} bind:open={modalOpen} onclose={handleModalClose} />
{/if}
