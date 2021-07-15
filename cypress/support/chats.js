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


Cypress.Commands.add("typeInSimulator", (message) => {
  cy.get("[data-testid=simulatorInput]")
    .click()
    .type(message + "{enter}");
  cy.wait(1000);
});
Cypress.Commands.add("checkResponseInSimulator", (response) => {
  cy.get("[data-testid=simulatedMessages]").should("contain", response);
});
