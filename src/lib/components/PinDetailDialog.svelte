<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';
	import PinDetail from './PinDetail.svelte';
	import { pinsStore } from '$lib/stores/pins.svelte.js';
	import type { Pin } from '$lib/types';

	let {
		pin,
		open = $bindable(true),
		onclose
	}: {
		pin: Pin;
		open: boolean;
		onclose: () => void;
	} = $props();

	async function handleDelete() {
		try {
			await pinsStore.softDeletePin(pin.id);
			toast.success(m.pin_deleted());
			open = false;
			onclose();
		} catch {
			toast.error(m.pin_delete_error());
		}
	}
</script>

<Dialog.Root bind:open onOpenChange={(v) => { if (!v) onclose(); }}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-40 bg-black/50" />
		<Dialog.Content
			class="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-surface p-6 shadow-lg"
		>
			<Dialog.Title class="sr-only">{pin.description || 'Pin detail'}</Dialog.Title>
			<Dialog.Close
				class="absolute right-4 top-4 rounded p-1 text-text-muted hover:text-text"
				aria-label="Close"
			>
				&#10005;
			</Dialog.Close>

			<PinDetail {pin} ondelete={handleDelete} />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
