<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';
	import { locales, getLocale, setLocale, type Locale } from '$lib/paraglide/runtime.js';

	let { children } = $props();
</script>

<Toaster />

<div class="min-h-screen bg-gray-50 text-gray-900">
	<nav class="border-b border-gray-200 bg-white px-6 py-3">
		<div class="mx-auto flex max-w-5xl items-center gap-6">
			<a href="/" class="text-lg font-semibold">{m.nav_brand()}</a>
			<a href="/example" class="text-sm text-gray-600 hover:text-gray-900">{m.nav_example()}</a>
			<div class="ml-auto">
				<select
					value={getLocale()}
					onchange={(e) => setLocale(e.currentTarget.value as Locale)}
					class="rounded border border-gray-300 bg-white px-2 py-1 text-sm"
					aria-label="Language"
				>
					{#each locales as locale}
						<option value={locale}>{locale.toUpperCase()}</option>
					{/each}
				</select>
			</div>
		</div>
	</nav>

	<main class="mx-auto max-w-5xl px-6 py-8">
		{@render children()}
	</main>
</div>
