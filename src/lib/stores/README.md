# stores/

Svelte state only, calls services.

## Rules

- Files here own reactive state using Svelte 5 runes (`$state`, `$derived`).
- Orchestrate by calling `services/` and `api/` — **no business logic inline**.
- **Never** import from `components/`.
- Use the `.svelte.ts` extension so runes are enabled.
- Name files `<domain>.store.svelte.ts`.
