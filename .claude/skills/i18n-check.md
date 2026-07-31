# i18n Check Skill

Every key must exist in all 3 locale files before the task is done.

## Locale files

```
public/locales/{en,ru,uk}/common.json    ← nav, footer, auth, buttons, shared UI
public/locales/{en,ru,uk}/animals.json   ← animal features
public/locales/{en,ru,uk}/payment.json   ← payment features
```

Auth keys live under `auth.login.*` and `auth.register.*` in `common.json`.

## Rules

1. Add key to all 3 locales before using `t("key")` in code
2. Use the correct namespace: `useTranslation("common" | "animals" | "payment")`
3. Values must be real translations — no `"TODO"`, no copying English into ru/uk
4. Nesting shape must be identical across all 3 locales

## Verify after adding any key

```bash
grep -r "the.key" public/locales/en/common.json
grep -r "the.key" public/locales/ru/common.json
grep -r "the.key" public/locales/uk/common.json
```

All 3 must match. Missing = violation.

## Forbidden

- `<p>Loading...</p>` — use `t("common.loading")` or equivalent
- Key in `en` missing from `ru` or `uk`
- `t("key")` without adding to locale files first
