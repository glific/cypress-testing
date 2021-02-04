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
    
    cy.get('*[class^="ContactBar_ContactInfoContainer"]').find('[data-testid="beneficiaryName"]').then((body) => {
      let contact_name;
      if (body[0].innerText !== "Simulator") {
        contact_name = body[0].innerText
        cy.get('[data-testid="dropdownIcon"')
        .click(); 
      } else {
        cy.get("#simulator").get('[data-testid="clearIcon"').click()
        cy.get('*[class^="ChatConversation_ChatName"]').eq(1).click()
        cy.get('[data-testid="beneficiaryName"]').then((body) => {
        contact_name = body[0].innerText
        });
        cy.get('[data-testid="dropdownIcon"')
        .click();
      }
      cy.contains("Block Contact").click();
      cy.contains("Confirm").click();
      cy.get('*[class^="MuiAlert-message"]').should("contain", "Contact blocked successfully");
      cy.visit("/blocked-contacts");
      cy.get('[data-testid="searchInput"]').click().type(contact_name);
      cy.get('[data-testid="additionalButton"]').first().click()
      cy.contains("Confirm").click();
      cy.get("div").should("contain", "Contact unblocked successfully");
    });

  });
});
