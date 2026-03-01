<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';
	import TagEditor from './TagEditor.svelte';
	import type { Pin } from '$lib/types';

	let {
		pin = $bindable()
	}: {
		pin: Pin;
	} = $props();

	async function handleTagsChange(tags: string[]) {
		// Optimistic update
		const prev = pin.tags;
		pin.tags = tags.map((name) => ({ name }));

		try {
			const res = await fetch(`/api/pins/${pin.id}/tags`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ tags })
			});
			if (!res.ok) throw new Error();
			const updated: Pin = await res.json();
			pin.tags = updated.tags;
			toast.success(m.tags_updated());
		} catch {
			pin.tags = prev;
			toast.error(m.tags_update_error());
		}
	}
</script>

<div class="flex flex-col gap-6 md:flex-row">
	{#if pin.sourceMediaUrl}
		<div class="md:w-1/2">
			<img
				src={pin.sourceMediaUrl}
				alt={pin.description || ''}
				class="w-full rounded-lg"
			/>
		</div>
	{/if}

	<div class="flex flex-1 flex-col gap-4">
		{#if pin.description}
			<p class="text-text">{pin.description}</p>
		{/if}

		{#if pin.sourceContextUrl}
			<a
				href={pin.sourceContextUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm text-accent hover:text-accent-hover"
			>
				{m.pin_source_link()} &rarr;
			</a>
		{/if}

		<TagEditor
			tags={pin.tags.map((t) => t.name)}
			ontagschange={handleTagsChange}
		/>
	</div>
</div>
