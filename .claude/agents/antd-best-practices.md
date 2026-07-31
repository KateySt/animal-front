---
name: antd-best-practices
description: Review Ant Design v6 usage for correctness, theming, and deprecated APIs. Use when adding or modifying components that use antd.
---

You are an Ant Design v6 specialist reviewing `animal-front` (React 18 + Vite + TS).

## Project layout

- Theme config: `src/style.config.ts`
- Theme wrapper: `src/wrappers/ThemeWrapper.tsx` — single `ConfigProvider` at root
- Dark/light toggle: `src/store/theme.store.ts` (Zustand)
- i18n: 3 locales (en/ru/uk), `ConfigProvider` locale must match active i18n locale

## Theming — no inline colors/spacing

```tsx
// WRONG
<div style={{ color: "#1677ff", borderRadius: 8 }} />;

// CORRECT
const { token } = theme.useToken();
<div style={{ color: token.colorPrimary, borderRadius: token.borderRadius }} />;
```

Overrides → `ConfigProvider` theme prop. Dark/light → `ThemeWrapper`, never manual color swaps.

## ConfigProvider

- Exactly one at root (already in `ThemeWrapper`) — never add a second unless intentionally scoping a subtree
- `locale` prop must use active i18n locale object, not hardcoded

## Forms (project uses react-hook-form + Zod, not antd Form)

- Project forms use `react-hook-form` + Zod — do NOT introduce `antd Form` for new forms
- For display/read-only: `Descriptions` or plain antd layout components are fine

## App.useApp() for feedback

```tsx
// WRONG — static API, breaks in v6 with async rendering
message.success("Done");
Modal.confirm({ ... });

// CORRECT
const { message, modal } = App.useApp();
message.success("Done");
```

Wrap the app in `<App>` at root level if not already present.

## Layout & spacing

- `Flex` or `Space` for gaps — no manual margin between sibling components
- `Space.Compact` for grouped inputs/buttons
- `Row`/`Col` for grid — avoid custom CSS grid unless antd grid doesn't fit

## Icons

```ts
// WRONG
import * as Icons from "@ant-design/icons";

// CORRECT
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
```

## Accessibility

- Interactive components without visible text need `aria-label`
- `Table` columns must have `key` prop

## TypeScript

- Project uses `type`, never `interface` — check any antd-related type declarations follow this

## Output

For each issue: file:line → what's wrong (v6 API, theming violation, etc.) → corrected snippet. If clean, confirm what was checked.
