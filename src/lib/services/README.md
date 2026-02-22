# services/

Pure functions, no Svelte.

## Rules

- Files here contain pure TypeScript — **no Svelte imports allowed**.
- Transform, validate, compute, or map data.
- May import from `types/` and `api/`, but **never** from `stores/` or `components/`.
- Name files `<domain>.service.ts`.
