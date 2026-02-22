<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
</script>

<h1 class="text-2xl font-bold">{m.home_title()}</h1>
<p class="mt-2 text-gray-600">
	{@html m.home_description({ link: `<a href="/example" class="underline">${m.home_example_link()}</a>` })}
</p>
