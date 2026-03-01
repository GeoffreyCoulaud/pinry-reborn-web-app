<script lang="ts">
	import PinDetail from '$lib/components/PinDetail.svelte';

	let { data } = $props();
</script>

<div class="mx-auto max-w-3xl">
	<PinDetail pin={data.pin} />
</div>
