<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import type { TagSearchResult } from '$lib/types';

	let {
		tags,
		ontagschange
	}: {
		tags: string[];
		ontagschange: (tags: string[]) => void;
	} = $props();

	let editing = $state(false);
	let inputValue = $state('');
	let suggestions: string[] = $state([]);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function removeTag(name: string) {
		const next = tags.filter((t) => t !== name);
		ontagschange(next);
	}

	function addTag(name: string) {
		const trimmed = name.trim().toLowerCase();
		if (!trimmed || tags.includes(trimmed)) return;
		ontagschange([...tags, trimmed]);
		inputValue = '';
		suggestions = [];
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTag(inputValue);
		} else if (e.key === 'Escape') {
			editing = false;
			inputValue = '';
			suggestions = [];
		}
	}

	function handleInput() {
		clearTimeout(debounceTimer);
		const q = inputValue.trim();
		if (!q) {
			suggestions = [];
			return;
		}
		debounceTimer = setTimeout(async () => {
			try {
				const res = await fetch(`/api/search/tags?q=${encodeURIComponent(q)}&limit=5`);
				if (!res.ok) return;
				const data = await res.json();
				suggestions = data.results.map((r: TagSearchResult) => r.tag.name);
			} catch {
				suggestions = [];
			}
		}, 300);
	}

	function startEditing() {
		editing = true;
	}
</script>

<div class="flex flex-wrap items-center gap-1.5">
	{#each tags as tag (tag)}
		<span class="inline-flex items-center gap-1 rounded-full bg-surface-hover px-2.5 py-1 text-xs text-text-muted">
			{tag}
			<button
				type="button"
				onclick={() => removeTag(tag)}
				class="ml-0.5 text-text-subtle hover:text-text"
				aria-label="Remove tag {tag}"
			>
				&times;
			</button>
		</span>
	{/each}

	{#if editing}
		<div class="relative">
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="text"
				bind:value={inputValue}
				oninput={handleInput}
				onkeydown={handleKeydown}
				onblur={() => { setTimeout(() => { editing = false; suggestions = []; }, 200); }}
				placeholder={m.tags_add()}
				class="w-32 rounded border border-border-muted bg-bg px-2 py-1 text-xs text-text focus:border-accent focus:outline-none"
				autofocus
			/>
			{#if suggestions.length > 0}
				<ul class="absolute left-0 top-full z-10 mt-1 w-40 rounded border border-border bg-surface py-1 shadow-md">
					{#each suggestions as suggestion (suggestion)}
						<li>
							<button
								type="button"
								class="w-full px-3 py-1.5 text-left text-xs text-text hover:bg-surface-hover"
								onmousedown={() => addTag(suggestion)}
							>
								{suggestion}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{:else}
		<button
			type="button"
			onclick={startEditing}
			class="rounded-full border border-dashed border-border-muted px-2 py-0.5 text-xs text-text-subtle hover:border-accent hover:text-accent"
		>
			+ {m.tags_add()}
		</button>
	{/if}
</div>
