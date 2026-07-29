#!/usr/bin/env node
// Runs tsc --noEmit after every Edit/Write to catch type errors immediately.
// Receives the PostToolUse hook payload as JSON on stdin.

import { execSync } from "child_process";

let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  const payload = JSON.parse(raw);
  const filePath = (payload.tool_input && payload.tool_input.file_path) || "";

  if (!filePath || !filePath.match(/\.(ts|tsx)$/)) process.exit(0);

  const cwd = "F:/animal-front";

  try {
    execSync("npx tsc --noEmit --pretty", { stdio: "inherit", cwd });
  } catch (_) {
    // tsc prints errors to stdout; exit 1 will surface them to Claude
    process.exit(1);
  }
});
