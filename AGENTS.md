# animal-front

## Stack

React 19 + React Router v7 (framework mode, SSR disabled) + Vite + TypeScript. UI: Ant Design v6. State: Zustand. Data: TanStack React Query + Axios. Forms: react-hook-form + Zod. Payments: Stripe. Voice/chat: LiveKit. i18n: i18next + react-i18next.

## Install

```
npm install
```

## Commands

`npm run dev` · `npm run build` (typegen + tsc + build) · `npm run lint` / `lint:fix` · `npm run format` / `format:check`

No test suite currently exists in this project.

## Env vars (`.env`)

`VITE_API_BASE_URL` (backend origin, e.g. `http://localhost:8000`; axios appends `/api`, Socket.IO uses the origin + `/ws`) · `VITE_STRIPE_PUBLIC_KEY`

The LiveKit URL comes from the backend token response, not from env. `VITE_AUTH_API_BASE_URL` and `VITE_CHAT_API_BASE_URL` in `.env.example` are unused. Running the full stack: see `../README.md`.

## File conventions

```
src/
  features/<name>/
    api/<name>.api.ts       # axios calls only
    hooks/use-<name>.ts     # business logic, returns { data, isLoading, error }
    types/<name>.types.ts   # type declarations
    schemas/<name>.schema.ts # Zod schemas (most features have this; not just api/hooks/types/components)
    utils/errors.ts         # feature-specific error mapping (most features have this)
    components/             # UI, no direct axios
  store/<name>.store.ts     # Zustand
  pages/<Name>Page.tsx
  wrappers/                 # route-level guards: AuthWrapper, AdminWrapper
  components/layout/        # MainLayout etc.
  routes.ts                 # Routes const + RouteConfig — never hardcode paths
```

Features: `animals` · `auth` · `chat` · `dashboard` (components only, no api/hooks) · `health-logs` · `rbac` (roles/permissions/resources/users admin) · `stripe`

## Routing

This is **React Router v7 framework mode**, not plain react-router-dom — routes live in `src/routes.ts`, which exports both the `Routes` path const and the default `RouteConfig` tree (`layout()`/`route()`/`index()`).

```ts
import { Routes } from "../routes";
// Routes.Home | .Animals | .AnimalDetail | .Profile | .Settings | .Payment | .Invoices
//        | .Login | .Register | .GoogleCallback | .Chat | .ChatSession
```

Never hardcode path strings. Dynamic routes: `Routes.AnimalDetail` uses `:animalId`, `Routes.Payment + "/:invoiceId"`, `Routes.ChatSession` uses `:sessionId`.

Layout nesting: `AuthWrapper` (requires auth) wraps everything except Login/Register/GoogleCallback → `MainLayout` (chrome) wraps all authenticated pages → `AdminWrapper` (checks `user.is_superuser`, else redirects to `Routes.Home`) additionally gates `Settings` only.

## TypeScript

- **Always `type`, never `interface`** — no exceptions currently in the codebase (auth types are all `type`)
- `TimeStamp = { created_at: string; updated_at: string }` — extend with `& TimeStamp`
- Const objects as enums: `const Foo = { A: "a" } as const; type FooType = (typeof Foo)[keyof typeof Foo]`

## i18n

Namespaces → files: `common` | `animals` | `payment` | `chat` | `settings` → `public/locales/{en,ru,uk}/{ns}.json`

```ts
import { Locale } from "../lib/locales"; // Locale.EN | .RU | .UK
const { t } = useTranslation("common");
```

Rules:

- All user-visible strings via `t()` — no hardcoded JSX text
- Add key to **all 3** locale files when adding new key
- `common`: nav, footer, auth, buttons; `animals`: animal features; `payment`: payment features; `chat`: chat/voice UI; `settings`: RBAC/admin settings UI
- Auth keys: `auth.login.*`, `auth.register.*` in common.json

## Axios

`src/lib/axios.ts` — base URL is `${VITE_API_BASE_URL}/api`, all calls use `/v1/...` paths. Two instances:

- `axiosInstance`: auto-attaches `Bearer` token, 401 → refresh → retry or logout + redirect `Routes.Login`
- `refreshInstance`: used only for `/auth/refresh`

API methods: always `.then(r => r.data)` — return the data directly, not the response.

## Zustand stores

- `useAuthStore` (devtools only, no persist) — `{ user, accessToken, isInitialized }` + setters + `logout()`
- `useChatStore` (devtools only, no persist) — `{ messagesBySession, statusBySession }` keyed by `sessionId`, with `getMessages`/`getStatus`/`setMessages`/`appendUserMessage`/`setUserMessageText`/`setAssistantMessageText`/`setStatus`/`removeMessage`/`reset`. `src/lib/clear-user-data.ts` calls `reset()` and `queryClient.clear()` when the logged-in user changes.
- `useThemeStore` (devtools + **persist**) — theme toggle; the only store that persists to storage

Access outside React: `useXxxStore.getState().method()`.

## Chat / Voice (LiveKit)

Chat is real-time voice/text over **LiveKit**, not HTTP streaming. `chatApi.getToken(sessionId)` fetches a LiveKit room token; `useChatRoom` (`features/chat/hooks/use-chat-room.ts`) drives `useTranscriptions`/`useChat`/`useVoiceAssistant` from `@livekit/components-react` and writes incremental text into `useChatStore` via `setUserMessageText` / `setAssistantMessageText` (each takes `isNew` to distinguish append vs. update-in-place). Messages render via `react-markdown` + `remark-gfm`.

## WebSocket (Socket.IO)

One app-wide socket, not per-feature raw WebSockets. `WSProvider` (`src/providers/WSProvider.tsx`) opens a `socket.io-client` connection once a user is authenticated (`useAuthStore` accessToken, handshake `auth: { token }`, `path: "/ws"`, origin = `WS_BASE_URL` from `src/lib/axios.ts` — **not** `BASE_URL`, which has `/api` appended and doesn't match the backend's root-mounted Socket.IO path) and exposes it via `WSContext`/`useWS()` (both defined in `src/providers/WSProvider.tsx`). The socket is created per login (`autoConnect: false`, connected in an effect), the handshake `auth` is a callback so reconnects send the current token, and a rejected handshake triggers one `refreshAccessToken()` + reconnect. `WSProvider` wraps the app in `root.tsx`, above route-level auth gating — it's a no-op until login.

Feature hooks consume the shared socket, they don't open their own connection: join a room on mount (`socket.emit("join_chat_session", { sessionId })`), listen for server events, leave on unmount. See `features/chat/hooks/use-document-status-socket.ts` for the pattern.

## Stripe / Payments

`Invoice` has `status: InvoiceStatusType`, `amount_in_cents`, `currency: CurrencyType`, `health_logs: HealthLog[]`. Payment flow: `PaymentPage` → `PaymentWidget` → `PaymentForm` → Stripe Elements.

## SOLID + Clean Code

- **S**: one component = one concern; business logic in hooks; no axios in components
- **O**: extend via props/composition, not if/else inside component; use map over `if(type==='cat')`
- **L**: wrappers around native elements must forward all native props (`React.ComponentProps<'button'>`)
- **I**: pass only needed props — `{ name, avatarUrl }` not `{ animal: Animal }` when only 2 fields used
- **D**: components depend on hooks/props, never on concrete axios calls
- Clean: `isLoading/hasError/selectedId` naming; no magic values; hooks >50 lines → split; JSX >3 levels → extract component; no dead code; no comments that repeat the code
