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
