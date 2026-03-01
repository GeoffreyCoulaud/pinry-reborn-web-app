<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { DropdownMenu } from 'bits-ui';
	import { m } from '$lib/paraglide/messages.js';
	import TagEditor from './TagEditor.svelte';
	import type { Pin } from '$lib/types';

	let {
		pin = $bindable(),
		ondelete
	}: {
		pin: Pin;
		ondelete?: () => void;
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
		<div class="relative md:w-1/2">
			<img
				src={pin.sourceMediaUrl}
				alt={pin.description || ''}
				class="w-full rounded-lg"
			/>
			{#if ondelete}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm hover:bg-black/60"
						aria-label={m.pin_actions()}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<circle cx="12" cy="5" r="2" />
							<circle cx="12" cy="12" r="2" />
							<circle cx="12" cy="19" r="2" />
						</svg>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="z-50 min-w-[8rem] rounded-lg border border-border bg-surface p-1 shadow-lg"
					>
						<DropdownMenu.Item
							class="cursor-pointer rounded px-3 py-2 text-sm text-red-600 hover:bg-surface-hover"
							onclick={ondelete}
						>
							{m.pin_delete()}
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
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
