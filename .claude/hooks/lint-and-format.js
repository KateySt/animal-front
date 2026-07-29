#!/usr/bin/env node
// Runs Prettier then ESLint --fix on the file that was just edited/written.
// Receives the PostToolUse hook payload as JSON on stdin.
// Uses dynamic import to stay compatible with ESM projects ("type":"module").

import { execSync } from 'child_process';

let raw = '';
process.stdin.on('data', chunk => (raw += chunk));
process.stdin.on('end', () => {
  const payload = JSON.parse(raw);
  const filePath =
    (payload.tool_input && payload.tool_input.file_path) ||
    (payload.tool_response && payload.tool_response.filePath) ||
    '';

  if (!filePath) process.exit(0);

  const cwd = 'F:/animal-front';
  const quoted = `"${filePath}"`;

  try {
    execSync(`npx prettier --write ${quoted}`, { stdio: 'inherit', cwd });
  } catch (_) {}

  try {
    execSync(`npx eslint --fix ${quoted}`, { stdio: 'inherit', cwd });
  } catch (_) {}
});
