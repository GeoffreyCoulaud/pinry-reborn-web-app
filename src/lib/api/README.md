# api/

HTTP calls only, no logic.

## Rules

- Files here make network requests and return typed responses.
- **Never** import from `services/` or `stores/`.
- No business logic — just fetch, deserialize, and return.
- Name files `<resource>.api.ts`.
