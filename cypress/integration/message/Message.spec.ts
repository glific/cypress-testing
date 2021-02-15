describe("Message", () => {
  beforeEach(function () {
    // login before each
    cy.login();
    cy.visit("/chat");
    cy.wait(500);
  });

  it("should tag a message", () => {
    cy.get('[data-testid="beneficiaryName"]').then((body) => {
      if (body[0].innerText !== "Simulator") {
        cy.get('[data-testid="simulatorIcon"]').click();
        cy.get("#simulator");
      }
    });
    cy.get("[data-testid=simulatorInput]")
      .click()
      .type("hi" + "{enter}")
      .wait(500);
    cy.get('[data-testid="messageOptions"]').last().click();
    cy.contains("Assign tag").click();
    cy.get('[title="Open"]').click().wait(500);
    cy.get(".MuiAutocomplete-popper").first().click();
    cy.get('[title="Close"]').click();
    cy.get('[data-testid="ok-button"]').click().wait(500);
    cy.contains("Tags added successfully");
  });

  it("should remove tag from a message", () => {
      cy.get('[data-testid="tags"]')
        .last()
        .find('[data-testid="deleteIcon"]')
        .click()
        .wait(500);
      cy.contains("Tag deleted successfully");
  });
});
