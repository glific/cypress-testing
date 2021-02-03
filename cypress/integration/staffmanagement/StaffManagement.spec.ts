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

  it("should remove group from staff", () => {
    cy.get('[data-testid="EditIcon"]').last().click();
    cy.get('[data-testid="searchChip"]')
      .first()
      .find('[data-testid="deleteIcon"]')
      .click();
    cy.get('[data-testid="submitActionButton"]').click();
    cy.contains("User edited successfully!");
  });
  
  it("should have table column", () => {
    cy.get("span").should("contain", "NAME");
    cy.get("span").should("contain", "PHONE NO");
    cy.get("span").should("contain", "ASSIGNED TO");
    cy.get("th").should("contain", "ACTIONS");
  });

  it("should redirect to chat screen", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type("Glific Admin" + "{enter}");
    cy.get("[data-testid=additionalButton]").click();
    cy.get("[data-testid=beneficiaryName]").should("contain", "Glific Admin");
  });

  it("should redirect to edit screen", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type("Glific Admin" + "{enter}");
    cy.get("[data-testid=EditIcon]").click();
    cy.get("h5").should("contain", "Edit User");
  });

  it("should save edit screen", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type("Glific Admin" + "{enter}");
    cy.get("[data-testid=EditIcon]").click();
    cy.get("[data-testid=submitActionButton]").click();
    cy.get("div").should("contain", "User edited successfully!");
  });

  it("should have require field", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type("Glific Admin" + "{enter}");
    cy.get("[data-testid=EditIcon]").click();
    cy.get('[type="text"]').first().clear();
    cy.get("[data-testid=submitActionButton]").click();
    cy.get("p").should("contain", "Name is required.");
  });

  it("should redirect to staff management page", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type("Glific Admin" + "{enter}");
    cy.get("[data-testid=EditIcon]").click();
    cy.get("[data-testid=cancelActionButton]").click();
    cy.get("h5").should("contain", "Staff Management");
>>>>>>> main
  });
});
