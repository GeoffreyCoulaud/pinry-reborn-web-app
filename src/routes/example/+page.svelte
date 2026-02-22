<!--
  Example route — wires a store to a presentational component.

  Pattern:
   route (+page.svelte)  →  reads from store
   store                 →  calls services for logic
   component             →  receives data as props (dumb)
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { pinStore } from '$lib/stores/example.store.svelte';
	import ExampleCard from '$lib/components/ExampleCard.svelte';
	import type { Pin } from '$lib/types';
	import { m } from '$lib/paraglide/messages.js';

	// Seed some demo data on mount (replace with a real API call).
	onMount(() => {
		const demo: Pin[] = [
			{ id: '1', title: 'Mountain Sunset', imageUrl: '', description: 'A warm sunset over the peaks.' },
			{ id: '2', title: 'City Lights', imageUrl: '' },
			{ id: '3', title: 'Ocean Breeze', imageUrl: '', description: 'Waves crashing on the shore.' }
		];
		pinStore.setPins(demo);
	});
</script>

<h1 class="text-2xl font-bold">{m.example_title()}</h1>
<p class="mt-1 text-sm text-text-muted">{m.example_pins_loaded({ count: String(pinStore.count) })}</p>

<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
	{#each pinStore.pins as pin (pin.id)}
		<ExampleCard {pin} />
	{/each}
</div>
