describe("Chats", () => {
  const searchName = "Col" + +new Date();
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat");
    cy.wait(500);
    cy.closeSimulator();
  });

  it("should search in chat search", () => {
    cy.get('[data-testid="searchInput"]')
      .click({ force: true })
      .wait(500)
      .type("Glific Simulator");
  });

  it("should check unread messages", () => {
    cy.get('[data-testid="savedSearchDiv"]').contains("Unread").click();
    cy.get('[data-testid="savedSearchDiv"]')
      .eq(1)
      .find("div:last()")
      .then((val) => {
        if (val[0].innerText === "0") {
          cy.get(".ConversationList_ListingContainer__2IFT- > ul")
            .find('[data-testid="empty-result"]')
            .should("contain", "You do not have any conversations.");
        } else {
          cy.get(".ConversationList_ListingContainer__2IFT- > ul")
            .find("a")
            .then((msgs) => {
              cy.wrap(msgs)
                .its("length")
                .should("eq", parseInt(val[0].innerText));
            });
        }
      });
  });

  it("Select searched contact", () => {
    cy.get('[data-testid="searchInput"]')
      .click({ force: true })
      .wait(500)
      .type("Glific Simulator");
    cy.get('[data-testid="name"]')
      .first()
      .should("contain", "Glific Simulator")
      .click({ force: true });
    cy.get("h6").should("contain", "Glific Simulator");
  });

  it("Advanced search with name/tag/keyword", () => {
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click({
      force: true,
    });
    cy.get('[data-testid="input"]').click().wait(500).type("Glific Simulator");
    cy.get('[data-testid="submitActionButton"]').click();
    cy.wait(500);
    cy.get('[data-testid="name"]')
      .first()
      .should("contain", "Glific Simulator");
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
    cy.get(".ConversationList_ListingContainer__2IFT- > ul").then((item) => {
      // if empty results found
      if (item.find('[data-testid="empty-result"]').length) {
        cy.contains(
          '[data-testid="empty-result"]',
          "You do not have any conversations."
        );
      }
    });
  });
});
