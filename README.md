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
