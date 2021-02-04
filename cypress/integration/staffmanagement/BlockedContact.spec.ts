describe("Blocked Contact", () => {
  beforeEach(function () {
    // login before each test
    cy.login();
  });

  it("should load blocked contacts list", () => {
  cy.visit("/blocked-contacts");
    cy.get("h5").should("contain", "Blocked contacts");
  });

  it("should block a contact", () => {
    cy.visit("/chat");
    
    cy.get('[data-testid="beneficiaryName"]').then((body) => {
      if (body[0].innerText !== "Simulator") {
        cy.get('[data-testid="dropdownIcon"')
        .click(); 
      } else {
        cy.get("#simulator").get('[data-testid="clearIcon"').click()
        cy.get('*[class^="ChatConversation_ChatName"]').eq(1).click()
        cy.get('[data-testid="dropdownIcon"')
        .click();
      }
      cy.contains("Block Contact").click();
      cy.contains("Confirm").click();
      cy.get("div").should("contain", "Contact blocked successfully");
    });

  });
});
