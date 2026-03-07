<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import { Toaster } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';
	import { locales, getLocale, setLocale, type Locale } from '$lib/paraglide/runtime.js';
	import CreatePinDialog from '$lib/components/CreatePinDialog.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	let { children, data } = $props();
	let createDialogOpen = $state(false);
</script>

<Toaster />

<div class="min-h-screen bg-bg text-text">
	{#if data.username}
		<nav class="border-b border-border bg-surface px-6 py-3">
			<div class="mx-auto flex items-center gap-4">
				<a href="/" class="shrink-0 text-lg font-semibold">{m.nav_brand()}</a>

				<SearchBar />

				<button
					type="button"
					onclick={() => (createDialogOpen = true)}
					class="shrink-0 rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
				>
					+ {m.pin_new()}
				</button>

				<a
					href="/bin"
					class="shrink-0 text-text-muted hover:text-text"
					aria-label={m.nav_bin()}
					title={m.nav_bin()}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M3 6h18" />
						<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
						<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
					</svg>
				</a>

				<span class="text-sm text-text-muted">{data.username}</span>
				<form method="POST" action="/logout" use:enhance>
					<button
						type="submit"
						class="text-sm text-text-muted hover:text-text"
					>
						{m.auth_logout()}
					</button>
				</form>
				<select
					value={getLocale()}
					onchange={(e) => setLocale(e.currentTarget.value as Locale)}
					class="rounded border border-border-muted bg-surface px-2 py-1 text-sm"
					aria-label="Language"
				>
					{#each locales as locale}
						<option value={locale}>{locale.toUpperCase()}</option>
					{/each}
				</select>
			</div>
		</nav>

		<CreatePinDialog bind:open={createDialogOpen} />
	{/if}

	<main class="px-6 py-8">
		{@render children()}
	</main>
</div>
