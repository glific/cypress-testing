#!/usr/bin/env bash
# Local quality gate for pre-push agent. Exits non-zero on failure.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "==> Typecheck (cypress)"
npx tsc --noEmit -p cypress/tsconfig.json

echo "==> Typecheck (wwebjs smoke)"
npx tsc --noEmit -p wwebjs/smoke/tsconfig.json

if [ -f scripts/whatsapp-flow-test/tsconfig.json ]; then
  echo "==> Typecheck (whatsapp-flow-test)"
  npx tsc --noEmit -p scripts/whatsapp-flow-test/tsconfig.json
fi

echo "==> ESLint"
yarn lint

echo "==> Prettier check"
npx prettier --check \
  "cypress/**/*.{ts,js}" \
  "wwebjs/**/*.ts" \
  ".github/**/*.{yml,yaml}" \
  "*.{json,md}" \
  "eslint.config.mjs" \
  ".prettierrc"

echo "==> All local checks passed"
