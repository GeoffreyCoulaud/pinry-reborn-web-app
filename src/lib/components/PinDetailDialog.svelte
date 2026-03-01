<script lang="ts">
	import { Dialog } from 'bits-ui';
	import PinDetail from './PinDetail.svelte';
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

			<PinDetail {pin} />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
