import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  { ignores: ["dist", "node_modules"] },

  js.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        URL: "readonly",
        Promise: "readonly",
        FormData: "readonly",
        URLSearchParams: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        Event: "readonly",
        RequestInit: "readonly",
        Response: "readonly",
        Headers: "readonly",
        MediaQueryListEvent: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "prettier/prettier": "error",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-duplicate-imports": "error",
      "prefer-const": "error",
      "no-undef": "off",
      eqeqeq: ["error", "always"],
    },
  },

  prettierConfig,
];
