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

Cypress.Commands.add("removeFromFarmerCollection", () => {
  cy.get('[data-testid="dropdownIcon"]').click();
  cy.get('[data-testid="collectionButton"]').click();
  if (
    cy
      .get('[data-testid="searchChip"]')
      .contains("Farmer")
      .should("be.visible")
  ) {
    cy.get('[data-testid="searchChip"]').contains("Farmer").next().click();
    cy.get("[data-testid=ok-button]").click();
  }
});

Cypress.Commands.add("checkContactInCollection", (collection,contactName) => {
  cy.get("[data-testid=staffManagementMenu]").click();
        cy.get('[data-testid="MenuItem"]')
          .first()
          .contains("Collections")
          .click();
        cy.wait(1000);
        cy.get('[data-testid="searchInput"]').type(collection).type("{enter}");
        cy.get('[data-testid="label"]').should("contain", collection);
        cy.get('[data-testid="listHeader"]')
          .next()
          .contains("View Details")
          .click();
        cy.wait(1000);
        cy.get("[data-testid=tableHead]")
          .should("not.be.empty")
          .then(() => {
            cy.get('[data-testid="searchInput"]')
              .type(contactName)
              .type("{enter}");
            cy.get("[data-testid=tableBody]").should("contain", contactName);
          });
});

Cypress.Commands.add("startFlowForGroup", (group, flow) => {
  cy.get(":nth-child(2) > a > .Chat_Title__1I4xo").click({ force: true });
      cy.get("[data-testid=searchInput]").type(group).type("{enter}");
      cy.get('[data-testid="name"]').last().click();
      cy.wait(1000);
      cy.get('[data-testid="dropdownIcon"]').click();
      cy.get('[data-testid="flowButton"]').click();
      cy.get('[data-testid="dropdown"]').click();
      cy.get('[data-testid="dialogBox"]')
        .next()
        .last()
        .contains(flow)
        .click();
      cy.get('[data-testid="ok-button"]').click();

})


     
     