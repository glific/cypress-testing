describe("Role - Staff - Collection", () => {
  const collectionName = "Restricted Group";

  beforeEach(function () {
    // login before each test
    cy.appLogin(Cypress.env("staff").phone, Cypress.env("staff").password);
    cy.visit("/collection");
  });

  it("should load collection list", () => {
    cy.get('[data-testid="label"]').contains(collectionName);
  });

  // issue in navigation
  // it("should edit collection", () => {
  //   cy.get("input[name=searchInput]")
  //     .click()
  //     .wait(500) //It's not the best way to wait for the dom to load, we need to find a better solution.
  //     .type(collectionName + "{enter}");
  //   cy.get("[data-testid=EditIcon]").click();
  //   cy.get('[data-testid="submitActionButton"]').click();
  //   cy.get("div").should("contain", "Collection edited successfully!");
  // });

  it("should add member to collection", () => {
    cy.get("input[name=searchInput]").type(collectionName + "{enter}");
    cy.get("[data-testid=additionalButton]").first().click();
    cy.get("[data-testid=autocomplete-element]")
      .type("Default receiver" + "{enter}")
      .wait(500);
    cy.get(".MuiAutocomplete-option").first().click();
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get("div").should("contain", "1 contact added");
  });

  it("should remove member from collection", () => {
    cy.get("input[name=searchInput]").type(collectionName + "{enter}");
    cy.contains("View Details").click();
    cy.get("input[name=searchInput]")
      .type("Default receiver" + "{enter}")
      .wait(500);
    cy.get('[data-testid="DeleteIcon"]').first().click({ force: true });
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get("div").should("contain", "Contact deleted successfully");
  });
});
