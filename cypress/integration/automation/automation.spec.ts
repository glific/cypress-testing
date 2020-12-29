describe("Flow", () => {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/flow");
  });

  it("should stop from changing the page without saving ", () => {
    cy.get('[data-testid="additionalButton"]').first().click();
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.get("#flow").find("#editor-container");
    cy.go("back");
    cy.get('[data-testid="dialogTitle"] > h2').should(
      "contain",
      "Do you want to navigate away without saving your changes?"
    );
  });
});
