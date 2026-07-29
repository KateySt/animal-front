# animal-front

## Install

Always use `--legacy-peer-deps` due to eslint peer dep conflict:

```
npm install --legacy-peer-deps
```

## Routing

All route paths are defined in `src/router/routes.ts` as the `Routes` const object.
**Always use `Routes.*` — never hardcode path strings.**

```ts
import { Routes } from "../router/routes";
// Routes.Home, Routes.Login, Routes.Register, Routes.Animals, Routes.Profile, Routes.Settings, Routes.Payment
```

## i18n (3 languages: EN / RU / UK)

Project uses `i18next` + `react-i18next` with lazy-loaded JSON files from `public/locales/{en,ru,uk}/{namespace}.json`.

Namespaces: `common`, `animals`, `payment`.
Language enum is in `src/lib/locales.ts`:

```ts
import { Locale } from "../lib/locales";
// Locale.EN = "en", Locale.RU = "ru", Locale.UK = "uk"
```

**Rules:**

- Every user-visible string must use `t()` — no hardcoded text in JSX.
- When adding a new key, add it to **all three** locale files: `en`, `ru`, `uk`.
- Use the namespace that matches the feature: `useTranslation("common")`, `useTranslation("payment")`, etc.
- Component-level labels (nav, footer, buttons) belong in `common.json`.

```tsx
const { t } = useTranslation("common");
// t("nav.home"), t("nav.animals"), t("footer.description"), etc.
```

## Code conventions

- SOLID + Clean Code (see memory).
- No hardcoded strings in JSX — always translate.
- No hardcoded route paths — always use `Routes.*`.
