# animal-front

Frontend for an animal shelter platform: animals and health logs, Stripe payments, RBAC admin,
and an AI chat assistant (text + voice over LiveKit, image generation, PDF documents).

> Running the whole system (API + worker + book-rag + frontend)? See the [root README](../README.md).

## Tech stack

| Layer        | Library                                          |
| ------------ | ------------------------------------------------ |
| Framework    | React 19 + React Router v7 (framework mode, SPA) |
| Build        | Vite 8                                           |
| Language     | TypeScript                                       |
| UI           | Ant Design v6, SCSS Modules                      |
| State        | Zustand 5                                        |
| Server state | TanStack React Query 5 + Axios                   |
| Forms        | react-hook-form + Zod                            |
| Realtime     | LiveKit (chat/voice)                             |
| Payments     | Stripe.js + React Stripe.js                      |
| i18n         | i18next + react-i18next                          |

## Getting started

Requirements: Node.js 20.19+ or 22.12+ (Vite 8), and the `animal` backend running on port 8000
together with its LiveKit worker (see [`animal/README.md`](../animal/README.md)).

```bash
cp .env.example .env     # Windows PowerShell: Copy-Item .env.example .env
npm install
npm run dev              # http://localhost:5173
```

### Environment

| Variable                 | Required | Example                 | Purpose                                                       |
| ------------------------ | -------- | ----------------------- | ------------------------------------------------------------- |
| `VITE_API_BASE_URL`      | yes      | `http://localhost:8000` | Backend origin. Axios uses `${VITE_API_BASE_URL}/api` |
| `VITE_STRIPE_PUBLIC_KEY` | yes      | `pk_test_...`           | Stripe Elements                                               |

The LiveKit server URL is not configured here: it comes from the backend's token response
(`POST /v1/anthropic-chat/{id}/token`). Add the frontend origin (`http://localhost:5173`) to the
backend's `CORS_ORIGINS`.

## Scripts

| Script         | Description                                 |
| -------------- | ------------------------------------------- |
| `dev`          | Start the dev server (`react-router dev`)   |
| `build`        | Route typegen + type-check + production build |
| `preview`      | Preview the production build locally        |
| `lint`         | Run ESLint                                  |
| `lint:fix`     | Run ESLint with auto-fix                    |
| `format`       | Format `src` with Prettier                  |
| `format:check` | Check formatting without writing            |

There is no test suite yet.

## Project structure

```
src/
├── root.tsx           # App shell: providers, auth bootstrap (clientLoader)
├── routes.ts          # Routes const + RouteConfig — never hardcode paths
├── features/          # animals · auth · chat · dashboard · health-logs · rbac · stripe
│   └── <name>/        # api/ · hooks/ · types/ · schemas/ · utils/ · components/
├── pages/             # Route-level page components
├── components/        # layout/ (MainLayout, header, footer) · ui/ (shared primitives)
├── store/             # Zustand stores (auth, chat, theme)
├── wrappers/          # Route guards (AuthWrapper, AdminWrapper), ThemeWrapper
├── lib/               # axios, query-client, i18n, stripe, clear-user-data
├── hooks/ · constants/ · types/ · styles/ · assets/
```

## Authentication

JWT access token in memory (`useAuthStore`) + httpOnly refresh cookie.

- On startup `root.tsx` `clientLoader` calls `/v1/auth/refresh` and `/v1/users/me`.
- `axiosInstance` attaches `Authorization: Bearer <token>`. On a 401 it calls `refreshAccessToken()`
  (one shared in-flight refresh for concurrent requests) and retries once. If the refresh fails,
  the user is logged out and redirected to `/login`.
- On logout or user change, `lib/clear-user-data.ts` clears the React Query cache and the chat store.
- Google OAuth is supported via `/auth/google/callback`.

## Routing

React Router v7 framework mode: routes live in `src/routes.ts`.

```ts
import { Routes } from "../routes";

navigate(Routes.Animals);
navigate(Routes.ChatSession.replace(":sessionId", id));
```

Never hardcode path strings.

## Chat

- Each chat session is a LiveKit room. `ChatWindow` fetches a room token and renders `LiveKitRoom`.
  The backend dispatches the agent worker into the room.
- `useChatRoom` sends typed messages with `useChat().send` and turns `useTranscriptions` (user STT +
  agent replies) into messages in `useChatStore.messagesBySession[sessionId]`. Voice mode reuses the
  same room and enables the microphone.
- `useReplyWatchdog` unlocks the input if a reply never arrives.
- Document upload status is polled every 3 s (`refetchInterval` in `use-chat-documents.ts`) while a
  document is embedding.
- Image generation is a plain HTTP call (`image.api.ts`).

## Internationalisation

Locales: `en`, `ru`, `uk` in `public/locales/{locale}/{namespace}.json`.

Namespaces: `common` (nav, auth, buttons, footer) · `animals` · `payment` · `chat` · `settings` (RBAC admin).

When adding a key, add it to all three locales.

## State management

| Store           | Persisted | Contents                                      |
| --------------- | --------- | --------------------------------------------- |
| `useAuthStore`  | No        | `user`, `accessToken`, `isInitialized`        |
| `useChatStore`  | No        | `messagesBySession`, `statusBySession`        |
| `useThemeStore` | Yes       | Current theme                                 |

Access stores outside React with `useXxxStore.getState()`.

## Payments

`Invoice` carries `status`, `amount_in_cents`, `currency` and `health_logs`. Flow:
`PaymentPage` → `PaymentWidget` → `PaymentForm` → Stripe Elements.

## Code conventions

- `type`, never `interface`.
- Entities with timestamps: `type Foo = { … } & TimeStamp`.
- Const objects instead of enums: `const Foo = { A: "a" } as const`.
- No axios in components: HTTP goes through `features/*/api`, components use hooks.
- One concern per file: split hooks over ~50 lines, extract JSX nested deeper than 3 levels.
- No dead code, no magic values, no comments that restate the code.

More detail for agents and contributors: [AGENTS.md](AGENTS.md).
