# Cypress testing (Glific E2E)

## Quality checks

```bash
yarn verify          # typecheck + eslint + prettier
yarn lint            # ESLint (cypress)
yarn format:check    # Prettier
yarn typecheck       # TypeScript
```

CI: `.github/workflows/lint.yml` runs the same on PRs and `main`.

## Pre-push workflow

Before pushing, run the **pre-push** agent:

```
Use the pre-push agent
```

It will:

1. Run `yarn verify`
2. Loop (each iteration, **in sequence**):
   - **code-reviewer-claude** — identify feedback on the local diff
   - **code-reviewer-coderabbit** — identify feedback via CodeRabbit CLI
   - Fix **low** criticality; ask you before **high** criticality fixes
3. Commit and push the current branch (never creates a new local branch)

CodeRabbit CLI: `brew install coderabbit` then `cr auth login`. If missing, pre-push continues with a warning from **code-reviewer-coderabbit**.
