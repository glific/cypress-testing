// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- login command (no backend needed) --
Cypress.Commands.add('login', () => {
  localStorage.setItem(
    'glific_session',
    JSON.stringify({
      access_token: 'fake-access-token-for-testing',
      renewal_token: 'fake-renewal-token-for-testing',
      token_expiry_time: '2099-01-01T00:00:00.000Z',
      last_login_time: new Date().toISOString(),
    })
  );
  localStorage.setItem(
    'glific_user',
    JSON.stringify({
      organization: { id: '1' },
      roles: [{ id: '1', label: 'Glific_admin' }],
    })
  );
});

// --app login--
Cypress.Commands.add('appLogin', (phone, password) => {
  cy.visit('/login');
  cy.get('input[type=tel]').type(phone);
  cy.get('input[type=password]').type(password);
  cy.get('[data-testid="SubmitButton"]').click();
  cy.get('div').should('contain', 'Chats');
});

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
