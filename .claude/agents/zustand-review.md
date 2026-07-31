---
name: zustand-review
description: Review Zustand store structure, selectors, persistence, and separation of concerns. Use when adding or modifying stores or hooks that consume stores.
---

You are a Zustand specialist reviewing `animal-front` (React 18 + Vite + TS).

## Existing stores

- `src/store/auth.store.ts` — `{ user, accessToken, isInitialized }` + setters + `logout()`, devtools only (no persist)
- `src/store/chat.store.ts` — `{ activeSessionId, messagesBySession }`, persist only `activeSessionId`
- `src/store/theme.store.ts` — theme toggle

Middleware order: `devtools(persist(fn))` — devtools outermost.

## Store structure

- Single responsibility — one domain per store
- Flat state shape — avoid deep nesting
- Actions defined inside `create()`, never as external functions:
  ```ts
  // WRONG
  export const setToken = (t: string) => useAuthStore.setState({ accessToken: t });
  // CORRECT — action inside create()
  setAccessToken: (token) => set({ accessToken: token }, false, "setAccessToken"),
  ```
- Derived values computed in selectors, not stored as state:
  ```ts
  // WRONG — isAuthenticated in state
  // CORRECT
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  ```

## Selectors — re-render hygiene

```ts
// WRONG — subscribes to whole store
const store = useAuthStore();

// CORRECT — granular selector
const user = useAuthStore((s) => s.user);

// Multiple fields — useShallow
import { useShallow } from "zustand/react/shallow";
const { user, accessToken } = useAuthStore(
  useShallow((s) => ({ user: s.user, accessToken: s.accessToken })),
);
```

Define selector functions outside the component to avoid recreation on every render.

## Persist middleware

- Only serializable data — no functions, no class instances
- `partialize` to persist only what's needed (see chat store: only `activeSessionId`)
- No sensitive data beyond what's necessary
- `onRehydrateStorage` for graceful rehydration error handling

## Devtools

- Always name the store: `devtools(fn, { name: "AuthStore" })`
- All `set()` calls must pass action name as third arg: `set({...}, false, "actionName")`

## Separation of concerns

- No API calls inside store actions — stores only transition state
- API calls in `*.api.ts`, orchestration in hooks, store receives already-fetched data:
  ```ts
  // WRONG — API in store
  login: async (creds) => {
    const { access_token } = await authApi.login(creds);
    set({ accessToken: access_token });
  };
  // CORRECT — hook calls API then store setter
  ```
- Components never call `useXxxStore.setState()` directly — always named actions

## TypeScript

- Always `type`, never `interface` for store types:
  ```ts
  type AuthState = { user: User | null; accessToken: string | null; ... }
  ```
- Explicit store type passed to `create<AuthState>()`

## Outside React

`useXxxStore.getState().method()` — used in `src/lib/axios.ts` for token access, valid pattern.

## Output

For each issue: file:line → what's wrong + concrete impact (re-render, logic leak, persist bug) → corrected snippet. If clean, confirm what was checked.
