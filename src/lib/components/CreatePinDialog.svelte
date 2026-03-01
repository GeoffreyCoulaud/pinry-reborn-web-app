<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';
	import type { Pin } from '$lib/types';

	let {
		open = $bindable(false),
		oncreated
	}: {
		open: boolean;
		oncreated: (pin: Pin) => void;
	} = $props();

	let sourceMediaUrl = $state('');
	let sourceContextUrl = $state('');
	let description = $state('');
	let submitting = $state(false);
	let previewError = $state(false);

	function reset() {
		sourceMediaUrl = '';
		sourceContextUrl = '';
		description = '';
		previewError = false;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!sourceMediaUrl.trim() || submitting) return;
		submitting = true;

		try {
			const res = await fetch('/api/pins', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sourceMediaUrl: sourceMediaUrl.trim(),
					sourceContextUrl: sourceContextUrl.trim() || undefined,
					description: description.trim() || undefined
				})
			});

			if (!res.ok) throw new Error('Failed to create pin');

			const pin: Pin = await res.json();
			toast.success(m.pin_created());
			oncreated(pin);
			open = false;
			reset();
		} catch {
			toast.error(m.pin_create_error());
		} finally {
			submitting = false;
		}
	}
</script>

<Dialog.Root bind:open onOpenChange={(v) => { if (!v) reset(); }}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-black/50" />
		<Dialog.Content
			class="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-6 shadow-lg"
		>
			<Dialog.Title class="text-lg font-semibold">{m.pin_new()}</Dialog.Title>

			<form onsubmit={handleSubmit} class="mt-4 space-y-4">
				<div>
					<label for="sourceContextUrl" class="block text-sm font-medium text-text">
						{m.pin_page_url()}
					</label>
					<p class="text-xs text-text-subtle">{m.pin_page_url_hint()}</p>
					<input
						id="sourceContextUrl"
						type="url"
						bind:value={sourceContextUrl}
						placeholder="https://example.com/article"
						class="mt-1 w-full rounded border border-border-muted bg-bg px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
					/>
				</div>

				<div>
					<label for="sourceMediaUrl" class="block text-sm font-medium text-text">
						{m.pin_image_url()} *
					</label>
					<p class="text-xs text-text-subtle">{m.pin_image_url_hint()}</p>
					<input
						id="sourceMediaUrl"
						type="url"
						required
						bind:value={sourceMediaUrl}
						oninput={() => { previewError = false; }}
						placeholder="https://example.com/photo.jpg"
						class="mt-1 w-full rounded border border-border-muted bg-bg px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
					/>
					{#if sourceMediaUrl.trim()}
						<div class="mt-2 overflow-hidden rounded border border-border-muted">
							{#if !previewError}
								<img
									src={sourceMediaUrl.trim()}
									alt="Preview"
									class="max-h-48 w-full object-contain"
									onerror={() => { previewError = true; }}
								/>
							{:else}
								<p class="px-3 py-4 text-center text-xs text-text-subtle">
									Could not load image preview. Make sure this is a direct link to an image file.
								</p>
							{/if}
						</div>
					{/if}
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-text">
						{m.pin_description()}
					</label>
					<textarea
						id="description"
						bind:value={description}
						rows="3"
						class="mt-1 w-full rounded border border-border-muted bg-bg px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none resize-none"
					></textarea>
				</div>

				<div class="flex justify-end gap-3">
					<Dialog.Close
						class="rounded px-4 py-2 text-sm text-text-muted hover:text-text"
					>
						{m.pin_cancel()}
					</Dialog.Close>
					<button
						type="submit"
						disabled={!sourceMediaUrl.trim() || submitting}
						class="rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
					>
						{m.pin_save()}
					</button>
				</div>
			</form>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
