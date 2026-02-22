# components/

Shared presentational components.

## Rules

- Components here are **dumb/presentational** — they receive data via props and emit events.
- **Never** import from `api/` or `stores/`.
- May import from `types/` and other components.
- Keep components focused: one concern per file.
