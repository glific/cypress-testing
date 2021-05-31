Cypress.Commands.add("deleteFlow", (name) => {
  // cy.get("[data-testid=resetButton]").click({ force: true });
  cy.wait(1000);
  cy.get("input[name=searchInput]")
    .click()
    .wait(500)
    .type(name + "{enter}");
  cy.get("[data-testid=DeleteIcon]").click();
  cy.get('[data-testid="ok-button"]').click({ force: true });
});

Cypress.Commands.add("fetchList", () => {
  cy.get("temba-select")
    .shadow()
    .find("temba-field")
    .find("div.selected")
    .click({ force: true });
});

Cypress.Commands.add("selectFirstValFromList", (text) => {
  cy.get("temba-select")
    .shadow()
    .find("temba-field")
    .find("temba-options")
    .first()
    .shadow()
    .find(".options-container")
    .find("div")
    .contains(text)
    .click({ force: true });
});

Cypress.Commands.add("enterInput", () => {
  const element = cy
    .get("temba-completion")
    .shadow()
    .find("temba-field")
    .find("temba-textinput")
    .shadow()
    .find("temba-field")
    .find("div.input-container")
    .find(".textinput")
    .click({ force: true });
});
