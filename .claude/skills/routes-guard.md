# Routes Guard Skill

Never hardcode a path string — always use `Routes.*`.

## Routes const (`src/router/routes.ts`)

```ts
Routes.HomePage | .Login | .Register | .Animals | .Profile | .Settings
       .Payment | .Chat | .ChatSession | .GoogleCallback
```

Dynamic: `Routes.Payment + "/:invoiceId"`, `Routes.ChatSession` contains `:sessionId`.

## Forbidden → correct

```ts
// FORBIDDEN
navigate('/animals');  <Link to="/login" />  window.location.href = '/login';

// CORRECT
import { Routes } from "../router/routes";
navigate(Routes.Animals);  <Link to={Routes.Login} />
```

Exception: `window.location.href` to an external URL (e.g. Google OAuth) is fine.

## APIs to check

`navigate()` · `<Link to>` · `<NavLink to>` · `redirect()` · `useMatch()` · `path:` in `src/router/index.tsx`

## Verify

```bash
grep -rn 'to="/' src/
grep -rn 'navigate("/' src/
```

Any match is a violation.

## Adding a new route

1. Add to `src/router/routes.ts`
2. Add lazy route to `src/router/index.tsx` using `Routes.*`
3. Reference `Routes.*` everywhere — never the raw string
