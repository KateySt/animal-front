# i18n Check Skill

Enforce that every i18n key added to this project exists in **all three** locale files.

---

## Locale file locations

```
public/locales/en/{namespace}.json
public/locales/ru/{namespace}.json
public/locales/uk/{namespace}.json
```

Namespaces: `common`, `animals`, `payment`.

---

## When to apply

Run this check automatically whenever you:

- Add a new `t("key")` call in any component or hook.
- Add a new key to any locale file.
- Move or rename an existing key.

---

## Rules

1. **All three locales must have the key.** If you add `t("auth.login.title")` to a component, open `en/common.json`, `ru/common.json`, and `uk/common.json` and verify the key exists in every one before finishing.

2. **Use the correct namespace.** Match the namespace to the feature:
   - Auth pages → `common.json` under `auth.login.*` or `auth.register.*`
   - Navigation, footer, shared UI → `common.json`
   - Animal features → `animals.json`
   - Payment features → `payment.json`

3. **Value must be a real translation — not a copy of the English string.** Placeholders like `"TODO"` or copying the English value into ru/uk is forbidden.

4. **Nested keys must be consistent across locales.** If `en` has `{ "auth": { "login": { "title": "..." } } }`, ru and uk must have the same nesting shape.

---

## How to verify

After adding any key, run this check for each new key `{ns}` and `{key}`:

```bash
grep -r "{key}" public/locales/en/{ns}.json
grep -r "{key}" public/locales/ru/{ns}.json
grep -r "{key}" public/locales/uk/{ns}.json
```

All three greps must return a match. If any is missing — add it before reporting the task done.

---

## Forbidden patterns

- Hardcoded user-visible strings in JSX: `<p>Loading...</p>` — always use `t("...")`.
- Keys present in `en` but missing in `ru` or `uk`.
- Using `t("key")` without adding the key to locale files first.
