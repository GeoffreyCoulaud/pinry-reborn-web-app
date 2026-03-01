<script lang="ts">
	import type { Pin } from '$lib/types';
	import { m } from '$lib/paraglide/messages.js';

	let { pin, onclick }: { pin: Pin; onclick: () => void } = $props();

	const MAX_TAGS = 5;
</script>

<button
	type="button"
	class="w-full cursor-pointer rounded-lg border border-border bg-surface text-left shadow-sm transition-shadow hover:shadow-md"
	{onclick}
>
	{#if pin.sourceMediaUrl}
		<img
			src={pin.sourceMediaUrl}
			alt={pin.description || ''}
			loading="lazy"
			class="w-full rounded-t-lg"
		/>
	{/if}
	<div class="p-3">
		{#if pin.description}
			<p class="line-clamp-3 text-sm text-text">{pin.description}</p>
		{/if}
		{#if pin.tags.length > 0}
			<div class="mt-2 flex flex-wrap gap-1">
				{#each pin.tags.slice(0, MAX_TAGS) as tag (tag.name)}
					<span class="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-text-muted">
						{tag.name}
					</span>
				{/each}
				{#if pin.tags.length > MAX_TAGS}
					<span class="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-text-subtle">
						+{pin.tags.length - MAX_TAGS}
					</span>
				{/if}
			</div>
		{/if}
	</div>
</button>
