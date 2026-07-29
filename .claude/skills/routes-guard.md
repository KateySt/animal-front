# Routes Guard Skill

Enforce that no route path string is ever hardcoded in this project.

---

## The single rule

**Always use `Routes.*` — never a raw path string.**

```ts
// FORBIDDEN
navigate('/animals');
<Link to="/login" />
<NavLink to="/profile" />

// CORRECT
import { Routes } from "../router/routes";
navigate(Routes.Animals);
<Link to={Routes.Login} />
<NavLink to={Routes.Profile} />
```

---

## Where Routes are defined

```
src/router/routes.ts  — the Routes const object
```

Available keys (as of project setup):
`Routes.Home`, `Routes.Login`, `Routes.Register`, `Routes.Animals`, `Routes.Profile`, `Routes.Settings`, `Routes.Payment`

If a new page is added, add its path to `routes.ts` first, then reference `Routes.NewPage`.

---

## When to apply

Check every occurrence of the following APIs — each one must use `Routes.*`, never a string literal:

- `navigate("...")` — React Router's `useNavigate`
- `<Link to="..." />`
- `<NavLink to="..." />`
- `redirect("...")` — loader/action redirects
- `useMatch("...")`
- `path:` in route definitions inside `src/router/index.tsx`

---

## How to verify before finishing a task

After writing any navigation or routing code, grep for raw path strings:

```bash
grep -rn 'to="/' src/
grep -rn "to='/" src/
grep -rn "navigate('/" src/
grep -rn 'navigate("/' src/
```

Any match is a violation — replace with the corresponding `Routes.*` value.

---

## Adding a new route

1. Add the path constant to `src/router/routes.ts`.
2. Add the route element to `src/router/index.tsx` using `Routes.NewRoute`.
3. Reference `Routes.NewRoute` everywhere — never the raw string.
