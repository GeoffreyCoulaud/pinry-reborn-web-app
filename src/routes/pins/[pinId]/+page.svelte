<script lang="ts">
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { m } from '$lib/paraglide/messages.js';
	import PinDetail from '$lib/components/PinDetail.svelte';

	let { data } = $props();

	async function handleDelete() {
		try {
			const res = await fetch(`/api/pins/${data.pin.id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error();
			toast.success(m.pin_deleted());
			goto('/');
		} catch {
			toast.error(m.pin_delete_error());
		}
	}
</script>

<div class="mx-auto max-w-3xl">
	<PinDetail pin={data.pin} ondelete={handleDelete} />
</div>
