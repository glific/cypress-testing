#!/usr/bin/env bash
# Run CodeRabbit CLI review (--agent JSON stream). Writes findings to stdout and a log file.
# Exit 0 when skipped (CLI missing/unauthenticated) or review completes with no critical/major findings.
# Exit 1 when findings include critical or major severity (agent should triage via pre-push-reviewer).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

CR_CMD=""
if command -v cr >/dev/null 2>&1; then
  CR_CMD=cr
elif command -v coderabbit >/dev/null 2>&1; then
  CR_CMD=coderabbit
else
  echo "WARN: CodeRabbit CLI not installed (install: brew install coderabbit or https://docs.coderabbit.ai/cli)"
  exit 0
fi

if ! $CR_CMD auth status >/dev/null 2>&1; then
  echo "WARN: CodeRabbit CLI is not authenticated. Run: cr auth login"
  exit 0
fi

BASE="${BASE_BRANCH:-main}"
if git show-ref --verify --quiet "refs/remotes/origin/${BASE}"; then
  BASE_REF="origin/${BASE}"
elif git show-ref --verify --quiet "refs/heads/${BASE}"; then
  BASE_REF="${BASE}"
else
  BASE_REF="${BASE}"
fi

OUT_DIR="${TMPDIR:-/tmp}/push-ready-coderabbit"
mkdir -p "$OUT_DIR"
LOG="$OUT_DIR/review-$(date +%s).jsonl"

echo "==> CodeRabbit review (base: $BASE_REF, log: $LOG)"
echo "    Waiting for review to complete (this may take several minutes)..."

# Stream JSONL; persist for the agent to re-read.
set +e
$CR_CMD review --agent --base "$BASE_REF" 2>&1 | tee "$LOG"
REVIEW_EXIT=${PIPESTATUS[0]}
set -e

if [ "$REVIEW_EXIT" -ne 0 ]; then
  echo "ERROR: CodeRabbit review failed (exit $REVIEW_EXIT). Run: cr doctor"
  exit 1
fi

# Summarize findings for the parent agent.
node -e "
const fs = require('fs');
const path = process.argv[1];
const lines = fs.readFileSync(path, 'utf8').split('\n').filter(Boolean);
const findings = [];
let complete = false;
for (const line of lines) {
  let ev;
  try { ev = JSON.parse(line); } catch { continue; }
  if (ev.type === 'complete') complete = true;
  if (ev.type === 'error') {
    console.error('CODERABBIT_ERROR:', ev.message || JSON.stringify(ev));
    process.exit(1);
  }
  if (ev.type === 'finding') findings.push(ev);
}
console.log('CODERABBIT_FINDINGS:', findings.length);
console.log('CODERABBIT_LOG:', path);
for (const f of findings) {
  console.log('---');
  console.log('severity:', f.severity);
  console.log('file:', f.fileName);
  console.log('comment:', (f.comment || f.codegenInstructions || '').slice(0, 500));
}
const blocking = findings.filter(f => f.severity === 'critical' || f.severity === 'major');
if (blocking.length) process.exit(1);
if (!complete && findings.length) process.exit(1);
" "$LOG"
