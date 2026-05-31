# Glific - Two Way Open Source Communication Platform

## Setup

Clone the repo and install the packages

### `yarn install`

## Configuration

- Copy the contents from `cypress.config.ts.example` to `cypress.config.ts`
- Update the `cypress.config.ts` file with your glific installed settings

## Execution

Integration testing for Glific using Cypress

### Interactive

- `yarn run cypress open`

Launches cypress test runner.

### Batch

- `yarn cy:run`

Command line without opening a browser (headless mode)

## Slow E2E Tests

The filesearch test suite (`cypress/e2e/filesearch/Filesearch.spec.ts`) is significantly slower than the rest of the tests. By default, regular CI runs **exclude** this suite to keep feedback fast.

To exclude the slow filesearch tests during local development, run Cypress with:

```
yarn cypress run --config excludeSpecPattern=cypress/e2e/filesearch/Filesearch.spec.ts
```

This will skip running the slow filesearch spec when executing your tests locally.

## Flow smoke test

The flow smoke test (`cypress/e2e/smoke.spec.ts`) runs against a live Glific instance, validates the `smoke-test` flow via the simulator, and reports pass/fail to Instatus.

Run locally (set prod credentials in `.env` or export `CYPRESS_*` vars; regular E2E tests keep using `phone` / `password` in `cypress.config.ts` for glific.test):

```
CYPRESS_baseUrl=https://prod.glific.com/ \
CYPRESS_smoke__phone=... \
CYPRESS_smoke__password=... \
INSTATUS_API_KEY=... \
INSTATUS_PAGE_ID=... \
INSTATUS_COMPONENT_ID=... \
yarn cypress run --spec cypress/e2e/smoke.spec.ts
```

CI runs this on a cron every 30 minutes via `.github/workflows/smoke.yml`.
