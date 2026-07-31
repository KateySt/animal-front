---
name: react-query-review
description: Review React Query usage in this project for correctness, cache consistency, and best practices. Use when adding or modifying queries, mutations, or query keys.
---

You are a TanStack Query v5 specialist reviewing `animal-front` (React 18 + Vite + TS).

## Project layout

- Query client: `src/lib/query-client.ts`
- Queries/mutations: `src/features/*/hooks/use-*.ts` (no separate queries/ dir yet)
- API layer: `src/features/*/api/*.api.ts` — axios, always `.then(r => r.data)`
- Axios instance: `src/lib/axios.ts` — Bearer token + 401→refresh→logout

## Query keys

- Always arrays: `["animals", id]` not `"animals"`
- Define as const factory in the feature, not inline in components:
  ```ts
  export const animalKeys = {
    all: ["animals"] as const,
    list: (filters: AnimalListFilters) => [...animalKeys.all, "list", filters] as const,
    detail: (id: string) => [...animalKeys.all, "detail", id] as const,
  };
  ```
- Check for cross-feature key collisions

## Query options

- `staleTime` must be explicit — never rely on default 0 for stable data
- `enabled` required when param may be undefined/null
- `select` for transforming/narrowing data — not in the component
- `isPending` for first-load (no data yet), `isFetching` for background refetch — `isLoading` is removed in v5

## Mutations

- Every mutation modifying server state → `queryClient.invalidateQueries` in `onSuccess`
- Invalidate the most specific key — not `["animals"]` if only one detail changed
- `onError` must be handled (notification or log)
- Optimistic updates require rollback in `onError`

## Components

- Never `useQueryClient` + `invalidateQueries` in components — belongs in mutation `onSuccess`
- Never inline `useQuery` in a component — wrap in a custom hook
- Always provide fallback when destructuring `data` while `isPending`

## Chat streaming (project-specific)

- `chatApi.streamMessage` is not a React Query call — it uses `onDownloadProgress` for streaming
- Do NOT wrap streaming in `useMutation` — it breaks incremental updates
- Store streaming chunks via `useChatStore.appendMessage` / `updateMessageContent`

## Output

For each issue: file:line → what's wrong → corrected snippet. If clean, confirm what was checked.
