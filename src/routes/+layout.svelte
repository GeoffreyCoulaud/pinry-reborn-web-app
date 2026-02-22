<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
</script>

<Toaster />

<div class="min-h-screen bg-gray-50 text-gray-900">
	<nav class="border-b border-gray-200 bg-white px-6 py-3">
		<div class="mx-auto flex max-w-5xl items-center gap-6">
			<a href="/" class="text-lg font-semibold">Pinry</a>
			<a href="/example" class="text-sm text-gray-600 hover:text-gray-900">Example</a>
		</div>
	</nav>

	<main class="mx-auto max-w-5xl px-6 py-8">
		{@render children()}
	</main>
</div>
