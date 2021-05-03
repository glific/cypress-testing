describe("Role - Staff - Chats", () => {
  const searchName = "Col" + +new Date();
  beforeEach(function () {
    // login before each test
    cy.appLogin(Cypress.env("staff").phone, Cypress.env("staff").password);
    cy.visit("/chat");
    cy.wait(500);
  });

  it("should search in chat search", () => {
    cy.get('[data-testid="searchInput"]')
      .click({ force: true })
      .wait(500)
      .type("Simulator");
  });

  it("Select searched contact", () => {
    cy.get('[data-testid="searchInput"]')
      .click({ force: true })
      .wait(500)
      .type("Simulator");
    cy.get('[data-testid="name"]')
      .first()
      .should("contain", "Simulator")
      .click({ force: true });
    cy.get("h6").should("contain", "Simulator");
  });

  it("Advanced search with name/tag/keyword", () => {
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click({
      force: true,
    });
    cy.get('[data-testid="input"]').click().wait(500).type("Simulator");
    cy.get('[data-testid="submitActionButton"]').click();
    cy.wait(500);
    cy.get('[data-testid="name"]').first().should("contain", "Simulator");
  });

  it("Advanced search with Includes tags", () => {
    cy.wait(1000);
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click({
      force: true,
    });
    cy.get('[data-testid="AutocompleteInput"]').first().click();
    cy.wait(500);
    cy.get(".MuiAutocomplete-option").first().click({ force: true });
    cy.get('[data-testid="submitActionButton"]').click();
    cy.wait(500);
    cy.get(".ConversationList_ChatListingContainer__18YGc > ul").then(
      (item) => {
        // if empty results found
        if (item.find('[data-testid="empty-result"]').length) {
          cy.contains(
            '[data-testid="empty-result"]',
            "You do not have any conversations."
          );
        }
      }
    );
  });
});
