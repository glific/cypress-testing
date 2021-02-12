describe("Staff Management", () => {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/staff-management");
  });

  it("should load staff management list", () => {
    cy.get("h5").should("contain", "Staff Management");
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
    cy.get("[data-testid=EditIcon]").click({force: true});
    cy.get("[data-testid=submitActionButton]").click();
    cy.wait(500);
    cy.get("div").should("contain", "User edited successfully!");
  });

  it("should have require field", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type("Glific Admin" + "{enter}");
    cy.get("[data-testid=EditIcon]").click({force: true});
    cy.get('[type="text"]').first().clear();
    cy.get("[data-testid=submitActionButton]").click();
    cy.get("p").should("contain", "Name is required.");
  });

  it("should redirect to staff management page", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type("Glific Admin" + "{enter}");
    cy.get("[data-testid=EditIcon]").click({force: true}).wait(500);
    cy.get("[data-testid=cancelActionButton]").click();
    cy.wait(1000);
    cy.get("h5").should("contain", "Staff Management");
  });
});
