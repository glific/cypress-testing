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
  'create_collection',
  (collectionName) => {
    cy.visit("/collection");
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(500); //It's not the best way to wait for the dom to load, we need to find a better solution.
    cy.get("input[name=label]").click().type(collectionName);
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("div").should("contain", "Collection created successfully!");
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
