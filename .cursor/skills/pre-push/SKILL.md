---
name: pre-push
description: >-
  Prepare the current branch for remote push: verify compile/lint/format, loop
  pre-push-reviewer sub-agent and CodeRabbit CLI (fix low criticality, confirm
  high with user), commit and push. Never creates a new local branch.
disable-model-invocation: true
---

# Pre-push

Follow [.claude/agents/pre-push.md](../../../.claude/agents/pre-push.md).

```bash
yarn verify
./scripts/push-ready/run-coderabbit.sh
```

Delegate diff review to **pre-push-reviewer** (no GitHub PR comment lookup).
