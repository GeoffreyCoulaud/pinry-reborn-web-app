<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages.js';

	let { form } = $props();

	let mode: 'login' | 'signup' = $state('login');

	function errorMessage(error: string): string {
		if (error === 'missing_fields') return m.auth_error_missing_fields();
		if (error === 'invalid_credentials') return m.auth_error_invalid_credentials();
		if (error === 'username_taken') return m.auth_error_username_taken();
		return m.auth_error_server_error();
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-bg px-4">
	<div class="w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-sm">
		<h1 class="mb-6 text-center text-2xl font-semibold text-text">{m.nav_brand()}</h1>

		<div class="mb-6 flex rounded-md border border-border-muted">
			<button
				type="button"
				class="flex-1 rounded-l-md px-4 py-2 text-sm font-medium transition-colors {mode === 'login'
					? 'bg-accent text-white'
					: 'bg-surface text-text-muted hover:text-text'}"
				onclick={() => (mode = 'login')}
			>
				{m.auth_login()}
			</button>
			<button
				type="button"
				class="flex-1 rounded-r-md px-4 py-2 text-sm font-medium transition-colors {mode === 'signup'
					? 'bg-accent text-white'
					: 'bg-surface text-text-muted hover:text-text'}"
				onclick={() => (mode = 'signup')}
			>
				{m.auth_signup()}
			</button>
		</div>

		{#if form?.error}
			<div class="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
				{errorMessage(form.error)}
			</div>
		{/if}

		<form method="POST" action="?/{mode}" use:enhance>
			<div class="mb-4">
				<label for="username" class="mb-1 block text-sm font-medium text-text">
					{m.auth_username()}
				</label>
				<input
					id="username"
					name="username"
					type="text"
					autocomplete={mode === 'signup' ? 'username' : 'username'}
					required
					value={form?.username ?? ''}
					class="w-full rounded-md border border-border-muted bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
				/>
			</div>

			<div class="mb-6">
				<label for="password" class="mb-1 block text-sm font-medium text-text">
					{m.auth_password()}
				</label>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
					required
					class="w-full rounded-md border border-border-muted bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
			>
				{mode === 'login' ? m.auth_login() : m.auth_signup()}
			</button>
		</form>
	</div>
</div>
