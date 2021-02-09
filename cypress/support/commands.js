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
// -- login command --
Cypress.Commands.add(
  "login",
  (phone = '91' + Cypress.env("phone"), password = Cypress.env("password")) => {
    return cy
      .request({
        method: "POST",
        url: Cypress.env("backendUrl") + "#q=cypress.io+cors",
        body: {
          user: {
            phone: phone,
            password: password,
          },
        },
      })
      .then((response) => {
        const session = JSON.stringify(response.body.data);
        localStorage.setItem("glific_session", session);
        localStorage.setItem("glific_user", JSON.stringify({  organization: { id: '1' }, roles: ['Admin'] }));
      });
  }
);
Cypress.Commands.add(
  'reset_simulator',
  () => {
    cy.visit("/chat");
    cy.get('[data-testid="beneficiaryName"]').then((body) => {
      if (body[0].innerText !== "Simulator") {
        cy.get('[data-testid="simulatorIcon"]').click();
      }
    });
    cy.get('[data-testid="dropdownIcon"]').click();
    cy.contains("Clear conversation").click();
    cy.get('[data-testid="ok-button"]').click();
    cy.get('[data-testid="app"]').contains("Conversation cleared for this contact")
  }
);
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
