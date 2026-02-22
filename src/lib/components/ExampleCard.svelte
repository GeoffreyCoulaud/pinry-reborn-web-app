<!--
  Presentational component — accepts props, renders UI.

  Rules:
   - Never import from api/ or stores/.
   - Receive data via props; emit events for user actions.
-->
<script lang="ts">
	import type { Pin } from '$lib/types';

	let { pin }: { pin: Pin } = $props();
</script>

<article class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
	<h2 class="text-base font-medium">{pin.title}</h2>
	{#if pin.description}
		<p class="mt-1 text-sm text-gray-500">{pin.description}</p>
	{/if}
</article>
