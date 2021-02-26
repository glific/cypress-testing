describe("Flow", () => {
  const flow = "test " + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat");
    cy.wait(500);
    // check if Simulator open, If not open, click on simulatorIcon
    cy.get('[data-testid="layout"]').then((body) => {
      if (body.find('[data-testid="clearIcon"]').length <= 0) {
        cy.get('[data-testid="simulatorIcon"]').click();
      }
    });
  });

  it("should load Flow list", () => {
    cy.get('[data-testid="app"]').then((body) => {
      if (body.find("No more simulators are available right now").length <= 0) {
        cy.get('[data-testid="beneficiaryName"]').should(
          "contain",
          "Simulator"
        );
        cy.get("[data-testid=simulatorInput]");
      }
    });
  });

  it("Test help flow", () => {
    cy.get('[data-testid="layout"]').then((body) => {
      if (body.find('[data-testid="simulatorInput"]').length > 0) {
        cy.get("[data-testid=simulatorInput]")
          .click()
          .type("help" + "{enter}");
        cy.wait(500);
        cy.get("[data-testid=simulatorInput]")
          .click()
          .type("1" + "{enter}");
      }
    });
  });

  it("Test activity flow", () => {
    cy.get('[data-testid="layout"]').then((body) => {
      if (body.find('[data-testid="simulatorInput"]').length > 0) {
        cy.get("[data-testid=simulatorInput]")
          .click()
          .type("activity" + "{enter}");
        cy.wait(500);
        cy.get("[data-testid=simulatorInput]")
          .click()
          .type("1" + "{enter}");
      }
    });
  });
});
