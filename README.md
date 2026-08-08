# animal-front

Frontend for an animal management platform with a built-in AI chat assistant and Stripe-powered payments.

## Tech stack

| Layer        | Library                     |
| ------------ | --------------------------- |
| Framework    | React 19 + Vite 8           |
| Language     | TypeScript 6                |
| UI           | Ant Design v6               |
| State        | Zustand 5                   |
| Server state | TanStack React Query 5      |
| HTTP         | Axios                       |
| Forms        | react-hook-form + Zod       |
| Payments     | Stripe.js + React Stripe.js |
| i18n         | i18next + react-i18next     |
| Styles       | SCSS Modules                |

## Getting started

npm install 
npm run dev

Copy .env.example to .env and fill in the values before running.

VITE_API_BASE_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_...

## Available scripts

| Script         | Description                          |
| -------------- | ------------------------------------ |
| dev          | Start the dev server                 |
| build        | Type-check + production build        |
| preview      | Preview the production build locally |
| lint         | Run ESLint                           |
| lint:fix     | Run ESLint with auto-fix             |
| format       | Format source with Prettier          |
| format:check | Check formatting without writing     |

## Project structure

src/
├── components/
│   ├── layout/        # AppHeader, AppFooter, MainLayout
│   └── ui/            # Shared UI primitives (UserButton, LoadingPage, …)
├── features/
│   ├── animals/       # Animal CRUD — api, hooks, types, components
│   ├── auth/          # Auth flows — api, hooks, schemas
│   ├── chat/          # AI chat — streaming, sessions, UI
│   └── stripe/        # Payments — invoice, payment form, Stripe Elements
├── pages/             # Route-level page components
├── router/
│   └── routes.ts      # Central Routes const — never hardcode paths
├── store/             # Zustand stores (auth, chat, theme)
├── hooks/             # App-level shared hooks
├── lib/               # axios.ts, i18n.ts, stripe.ts, query-client.ts
├── types/             # Shared base types (TimeStamp, etc.)
├── constants/         # App-wide constants
└── wrappers/          # App initialisation wrappers (auth, theme, i18n)

## Authentication

Token-based auth with silent refresh. axiosInstance attaches a Bearer token on every request. On a 401 response the interceptor:

1. Pauses all in-flight requests.
2. Calls /auth/refresh via a separate refreshInstance (no auth header, uses the httpOnly refresh cookie).
3. Retries the queued requests with the new token.
4. On refresh failure — clears auth state and redirects to /login.

Google OAuth is also supported via /auth/google/callback.

## Routing

All routes are defined in src/router/routes.ts and consumed as:

import { Routes } from "../router/routes";

navigate(Routes.Animals);
navigate(`${Routes.ChatSession.replace(":sessionId", id)}`);

Never hardcode path strings anywhere else.

## Internationalisation

Three locales: en, ru, uk. Translation files live under public/locales/{en,ru,uk}/.

Namespaces:

- common — navigation, auth, buttons, footer
- animals — animal feature strings
- payment — payment feature strings

When adding a new key, always add it to all three locale files.

## State management

| Store           | Persisted              | Contents                               |
| --------------- | ---------------------- | -------------------------------------- |
| useAuthStore  | No                     | user, accessToken, isInitialized |
| useChatStore  | activeSessionId only | Active session + messages by session   |
| useThemeStore | Yes                    | Current theme                          |

Access stores outside React components via useXxxStore.getState().

## Chat / streaming
chatApi.streamMessage(dto, onChunk) sends a message and streams the response using responseType: "text" + onDownloadProgress. Each progress event delivers an incremental text delta to onChunk. Messages are stored in useChatStore.messagesBySession[sessionId].

## Payments

Invoice carries status, amount_in_cents, currency, and health_logs. The payment flow is:

PaymentPage → PaymentWidget → PaymentForm → Stripe Elements

## Code conventions

- Types, not interfaces — use type everywhere; avoid interface.
- Extend `TimeStamp` — type Foo = { … } & TimeStamp for entities with created_at / updated_at.
- Const enums — const Foo = { A: "a" } as const; type FooType = (typeof Foo)[keyof typeof Foo].
- No axios in components — all HTTP calls go through feature api files; components consume hooks.
- One concern per file — if a hook exceeds ~50 lines, split it; if JSX nests more than 3 levels, extract a component.
- No dead code, no magic values, no comments that restate the code.