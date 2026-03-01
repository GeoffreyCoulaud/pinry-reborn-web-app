<script lang="ts">
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages.js';
	import type { TagSearchResult } from '$lib/types';

	let inputValue = $state('');
	let suggestions: string[] = $state([]);
	let showSuggestions = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function handleInput() {
		clearTimeout(debounceTimer);
		const q = inputValue.trim();
		if (!q) {
			suggestions = [];
			showSuggestions = false;
			return;
		}
		debounceTimer = setTimeout(async () => {
			try {
				const res = await fetch(`/api/search/tags?q=${encodeURIComponent(q)}&limit=5`);
				if (!res.ok) return;
				const data = await res.json();
				suggestions = data.results.map((r: TagSearchResult) => r.tag.name);
				showSuggestions = suggestions.length > 0;
			} catch {
				suggestions = [];
				showSuggestions = false;
			}
		}, 300);
	}

	function submit() {
		const q = inputValue.trim();
		if (!q) return;
		showSuggestions = false;
		goto(`/search?q=${encodeURIComponent(q)}`);
	}

	function selectSuggestion(tag: string) {
		inputValue = tag;
		showSuggestions = false;
		goto(`/search?q=${encodeURIComponent(tag)}`);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			submit();
		} else if (e.key === 'Escape') {
			showSuggestions = false;
		}
	}

	function handleBlur() {
		setTimeout(() => { showSuggestions = false; }, 200);
	}
</script>

<div class="relative flex-1">
	<input
		type="search"
		bind:value={inputValue}
		oninput={handleInput}
		onkeydown={handleKeydown}
		onfocus={() => { if (suggestions.length > 0) showSuggestions = true; }}
		onblur={handleBlur}
		placeholder={m.search_placeholder()}
		class="w-full rounded border border-border-muted bg-bg px-3 py-1.5 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
	/>
	{#if showSuggestions}
		<ul class="absolute left-0 top-full z-20 mt-1 w-full rounded border border-border bg-surface py-1 shadow-md">
			{#each suggestions as suggestion (suggestion)}
				<li>
					<button
						type="button"
						class="w-full px-3 py-2 text-left text-sm text-text hover:bg-surface-hover"
						onmousedown={() => selectSuggestion(suggestion)}
					>
						{suggestion}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
