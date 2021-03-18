describe("Staff Management", () => {
  const date = new Date();
  const collectionName = "Sample Collection " + +date.getDate();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/staff-management");
    cy.wait(500);
  });

    it("should create new collection", () => {
      cy.create_collection(collectionName);
    });

  it("should assign collection to staff and add contact to collection", () => {
    cy.get('[data-testid="tableBody"]').then((body) => {
      cy.contains("NGO Staff")
        .parent()
        .parent()
        .parent()
        .children()
        .find('[data-testid="EditIcon"]')
        .click({ force: true });
      cy.get('[title="Open"]').last().click();
      cy.get(".MuiAutocomplete-option")
        .contains(collectionName)
        .children()
        .click();
      cy.get('[title="Close"]').last().click();
      cy.get('[data-testid="submitActionButton"]').click({ force: true });
      cy.contains("User edited successfully!");
      
      cy.visit("/collection")
      cy.get("input[name=searchInput]").type(collectionName + "{enter}");
      cy.get("[data-testid=additionalButton]").first().click();
      cy.get("[data-testid=autocomplete-element]")
        .type("Simulator" + "{enter}")
        .wait(500);
      cy.get(".MuiAutocomplete-option").first().click();
      cy.get('[data-testid="ok-button"]').click({ force: true });
      cy.get("div").should("contain", "1 contact added");
    });
  });
});
