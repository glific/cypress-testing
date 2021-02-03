describe("Staff Management", () => {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/staff-management");
  });

  it("should load staff management list", () => {
    cy.get("h5").should("contain", "Staff Management");
  });

  it("should change role of staff", () => {
    cy.get('[data-testid="EditIcon"]').first().click();
    cy.get('[title="Open"]').first().click();
    cy.get(".MuiAutocomplete-option").last().click();
    cy.get('[data-testid="submitActionButton"]').click();
    cy.contains("User edited successfully!");
  });
});
