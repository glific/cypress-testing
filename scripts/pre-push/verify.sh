#!/usr/bin/env bash
# Local quality gate for pre-push agent. Exits non-zero on failure.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "==> Typecheck (cypress)"
npx tsc --noEmit -p cypress/tsconfig.json

echo "==> ESLint"
yarn lint

echo "==> Prettier check"
npx prettier --check \
  "cypress/**/*.{ts,js}" \
  ".github/**/*.{yml,yaml}" \
  "*.{json,md}" \
  "eslint.config.mjs" \
  ".prettierrc"

echo "==> All local checks passed"
