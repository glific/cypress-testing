describe("Message", () => {
  beforeEach(function () {
    // login before each
    cy.login();
    cy.visit("/chat");
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
    .wait(500)
    .type("hi" + "{enter}");
    cy.get('[data-testid="messageOptions"]').last().click();
    cy.contains("Assign tag").click()
  });
});
