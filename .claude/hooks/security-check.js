#!/usr/bin/env node
// Fast grep-based security check after every Edit/Write.
// Catches critical patterns specific to this React/Axios/Stripe stack.
// Receives the PostToolUse hook payload as JSON on stdin.

import { execSync } from "child_process";

const CHECKS = [
  {
    pattern: "dangerouslySetInnerHTML",
    message:
      "dangerouslySetInnerHTML detected — XSS risk. Sanitize input or use a safe alternative.",
  },
  {
    pattern: "eval(",
    message: "eval() detected — code injection risk. Never use eval().",
  },
  {
    pattern: "new Function(",
    message: "new Function() detected — code injection risk.",
  },
  {
    pattern: "localStorage\\.setItem.*token",
    message: "Token stored in localStorage directly — use auth.store.ts (Zustand persist) instead.",
    isRegex: true,
  },
  {
    pattern: "localStorage\\.setItem.*secret",
    message: "Secret stored in localStorage — never store secrets in localStorage.",
    isRegex: true,
  },
  {
    pattern: "import axios",
    message:
      "Direct axios import in component — use the shared axios instance from src/lib/axios.ts via a service/hook layer (DI rule).",
    skipPaths: ["src/lib/axios.ts"],
  },
  {
    pattern: "process\\.env\\.VITE_",
    message:
      "VITE_ env var accessed directly — ensure this is not a secret key exposed to the client bundle.",
    isRegex: true,
    skipPaths: ["src/lib/", "src/config/"],
  },
  {
    pattern: "publishableKey.*sk_live",
    message:
      "Stripe SECRET key found in client code — only publishable keys (pk_) are safe on the frontend.",
    isRegex: true,
  },
];

let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  const payload = JSON.parse(raw);
  const filePath = (payload.tool_input && payload.tool_input.file_path) || "";

  if (!filePath || !filePath.match(/\.(ts|tsx|js|jsx)$/)) process.exit(0);

  const violations = [];

  for (const check of CHECKS) {
    if (check.skipPaths && check.skipPaths.some((skip) => filePath.includes(skip))) {
      continue;
    }

    try {
      const flag = check.isRegex ? "-P" : "-F";
      execSync(`grep -n ${flag} "${check.pattern}" "${filePath}"`, { stdio: "pipe" });
      violations.push(`  [SECURITY] ${check.message}`);
    } catch (_) {
      // grep exits 1 when no match — that's the happy path
    }
  }

  if (violations.length > 0) {
    console.error("\n Security issues found in " + filePath + ":\n");
    violations.forEach((v) => console.error(v));
    console.error("");
    process.exit(1);
  }
});
