describe("Chats", () => {
  const collectionName = "Col" + +new Date();
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat");
    cy.wait(500);
  });

  it("should search in chat search", () => {
    if (cy.get('[data-testid="clearIcon"]')) {
      cy.get('[data-testid="clearIcon"]').click();
    }
    cy.get('[data-testid="searchInput"]').click({ force: true });
    cy.get('[data-testid="searchInput"]').type("Default");
  });

  it("Select searched contact", () => {
    if (cy.get('[data-testid="clearIcon"]')) {
      cy.get('[data-testid="clearIcon"]').click();
    }
    cy.get('[data-testid="searchInput"]').click({ force: true });
    cy.get('[data-testid="searchInput"]').type("Simulator");
    cy.contains("Simulator").click({ force: true });
    cy.get('[data-testid="beneficiaryName"]').contains("Simulator");
  });

  it("Advanced search with name/tag/keyword", () => {
    if (cy.get('[data-testid="clearIcon"]')) {
      cy.get('[data-testid="clearIcon"]').click();
    }
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click({
      force: true,
    });
    cy.get('[data-testid="input"]').click().type("Simulator");
    cy.get('[data-testid="submitActionButton"]').click();
    cy.contains("Simulator");
  });

  it("Advanced search create collection", () => {
    if (cy.get('[data-testid="clearIcon"]')) {
      cy.get('[data-testid="clearIcon"]').click();
    }
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click({
      force: true,
    });
    cy.get('[data-testid="AutocompleteInput"]')
      .first()
      .click()
      .type("Important");
    cy.get(".MuiAutocomplete-option").first().click();
    cy.get('[data-testid="AutocompleteInput"]')
      .eq(1)
      .click({ force: true })
      .type("Group");
    cy.get(".MuiAutocomplete-option").first().click();
    cy.get('[data-testid="AutocompleteInput"]')
      .eq(2)
      .click({ force: true })
      .type("Glific");
    cy.get(".MuiAutocomplete-option").first().click();
    cy.get('[data-testid="date-picker-inline"]')
      .eq(0)
      .click({ force: true })
      .type("01/01/2021");
    cy.get('[data-testid="date-picker-inline"]')
      .eq(1)
      .click({ force: true })
      .type("01/31/2021");

    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("[data-testid=tooltip] > .MuiButton-label").click({ force: true });
    cy.get('[data-testid="outlinedInput').eq(0).click().type(collectionName);
    cy.get('[data-testid="outlinedInput')
      .eq(1)
      .click()
      .type("Sample collection");
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("div").should("contain", "Collection created successfully");
  });

  it("Advanced search with Includes tags", () => {
    if (cy.get('[data-testid="clearIcon"]')) {
      cy.get('[data-testid="clearIcon"]').click();
    }
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click({
      force: true,
    });
    cy.get('[data-testid="AutocompleteInput"]').first().click().type("Unread");
    cy.get(".MuiAutocomplete-option").first().click();
    cy.get('[data-testid="submitActionButton"]').click();
  });
});
