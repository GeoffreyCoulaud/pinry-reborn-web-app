<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import type { Pin } from '$lib/types';

	let {
		pin,
		onrestore,
		ondelete
	}: {
		pin: Pin;
		onrestore: () => void;
		ondelete: () => void;
	} = $props();
</script>

<div
	class="rounded-lg border border-border bg-surface shadow-sm"
>
	{#if pin.sourceMediaUrl}
		<img
			src={pin.sourceMediaUrl}
			alt={pin.description || ''}
			loading="lazy"
			class="w-full rounded-t-lg opacity-60"
		/>
	{/if}
	<div class="p-3">
		{#if pin.description}
			<p class="line-clamp-3 text-sm text-text-muted">{pin.description}</p>
		{/if}
		<div class="mt-3 flex gap-2">
			<button
				type="button"
				onclick={onrestore}
				class="flex-1 rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
			>
				{m.bin_restore()}
			</button>
			<button
				type="button"
				onclick={ondelete}
				class="flex-1 rounded border border-red-600 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white"
			>
				{m.bin_delete_forever()}
			</button>
		</div>
	</div>
</div>
