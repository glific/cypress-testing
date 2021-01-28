describe("Profile", () => {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/user-profile");
  });

  it("should load profile page and save successfully", () => {
    cy.get("h5").should("contain", "Edit Contact");
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("div").should("contain", "Contact edited successfully!");
  });

  it("should have form validation", () => {
    cy.get('[type="text"]').first().clear();
    cy.get("[data-testid=submitActionButton]").click();
    cy.get("p").should("contain", "Name is required.");
    cy.get("#mui-component-select-languageId").contains("English");
  });

  it("should not submit empty form", () => {
    cy.get('[type="text"]').first().clear();
    cy.get("[data-testid=submitActionButton]").click();
    cy.get("p").should("contain", "Name is required.");
  });

  it("should be disabled: Phone number, status, provider status", () => {
    cy.get('[type="text"]').eq(1).should("be.disabled");
    cy.get("#mui-component-select-status").should("have.class", "Mui-disabled");
    cy.get("#mui-component-select-bspStatus").should(
      "have.class",
      "Mui-disabled"
    );
  });

  it("should redirect to chat", () => {
    cy.get("[data-testid=cancelActionButton] > .MuiButton-label").click();
    cy.url().should("include", "/chat/");
  });
});
