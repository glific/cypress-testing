import { defineConfig } from 'cypress'

export default defineConfig({
  env: {
    backendUrl: 'https://api.glific.test:4001/api',
    phone: '7834811114',
    password: 'secret1234',
    staff: {
      phone: '9820112345',
      password: '12345678',
    },
  },
  defaultCommandTimeout: 8000,
  projectId: 'ocex65',
  retries: {
    runMode: 2,
  },
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://glific.test:3000/',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
