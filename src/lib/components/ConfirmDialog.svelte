<script lang="ts">
	import { AlertDialog } from 'bits-ui';
	import { m } from '$lib/paraglide/messages.js';

	let {
		open = $bindable(false),
		title,
		description,
		confirmLabel,
		onconfirm
	}: {
		open: boolean;
		title: string;
		description: string;
		confirmLabel: string;
		onconfirm: () => void;
	} = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="fixed inset-0 z-40 bg-black/50" />
		<AlertDialog.Content
			class="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-6 shadow-lg"
		>
			<AlertDialog.Title class="text-lg font-semibold">{title}</AlertDialog.Title>
			<AlertDialog.Description class="mt-2 text-sm text-text-muted">
				{description}
			</AlertDialog.Description>

			<div class="mt-6 flex justify-end gap-3">
				<AlertDialog.Cancel
					class="rounded px-4 py-2 text-sm text-text-muted hover:text-text"
				>
					{m.pin_cancel()}
				</AlertDialog.Cancel>
				<AlertDialog.Action
					class="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
					onclick={onconfirm}
				>
					{confirmLabel}
				</AlertDialog.Action>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
