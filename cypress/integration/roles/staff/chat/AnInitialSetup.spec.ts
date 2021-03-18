describe("Staff Management", () => {
  const collectionName = "Sample Collection " + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/staff-management");
    cy.wait(500);
  });

  //   it("should create new collection", () => {
  //     cy.create_collection(collectionName);
  //   });

  it("should assign collection to staff", () => {
    cy.get('[data-testid="tableBody"]').then((body) => {
      cy.contains("NGO Staff")
        .parent()
        .parent()
        .parent()
        .children().find('[data-testid="EditIcon"]').click({ force: true });
    });

    //   get('[data-testid="EditIcon"]').click({ force: true });
    // cy.get('[data-testid="tableBody"]').last().click({ force: true });
    // cy.contains("NGO Staff").;
    // cy.get('[title="Open"]').last().click();
    // cy.get(".MuiAutocomplete-option")
    //   .contains(collectionName)
    //   .children()
    //   .click();
    // cy.get('[title="Close"]').last().click();
    // cy.get('[data-testid="submitActionButton"]').click({ force: true });
    // cy.contains("User edited successfully!");
  });
});
