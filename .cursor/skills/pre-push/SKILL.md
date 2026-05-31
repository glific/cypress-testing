---
name: pre-push
description: >-
  Prepare the current branch for remote push: verify compile/lint/format, loop
  code-reviewer-claude and code-reviewer-coderabbit in sequence (identify
  feedback, fix low criticality, confirm high with user), commit and push.
  Never creates a new local branch.
disable-model-invocation: true
---

# Pre-push

Follow [.claude/agents/pre-push.md](../../../.claude/agents/pre-push.md).

```bash
./scripts/pre-push/verify.sh
```

Review loop (in order each iteration):

1. **code-reviewer-claude** — local diff, JSON findings
2. **code-reviewer-coderabbit** — `./scripts/pre-push/run-coderabbit.sh`, JSON findings

Fix **low** criticality; ask before **high**. Re-run both reviewers after fixes until clean.
