describe("Chats", () => {
  const searchName = "Col" + +new Date();
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat");
    cy.wait(500);
    cy.get('[data-testid="beneficiaryName"]').then((body) => {
      if (body[0].innerText === "Simulator") {
        cy.get('[data-testid="clearIcon"]').click();
      }
    });
  });

  it("should search in chat search", () => {
    cy.get('[data-testid="searchInput"]').click({ force: true });
    cy.get('[data-testid="searchInput"]').type("Default");
  });

  it("Select searched contact", () => {
    cy.get('[data-testid="searchInput"]').click({ force: true });
    cy.get('[data-testid="searchInput"]').type("Simulator");
    cy.contains("Simulator").click({ force: true });
    cy.get('[data-testid="beneficiaryName"]').contains("Simulator");
  });

  it("Advanced search with name/tag/keyword", () => {
    cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click({
      force: true,
    });
    cy.get('[data-testid="input"]').click().wait(500).type("Simulator");
    cy.get('[data-testid="submitActionButton"]').click();
    cy.wait(500);
    cy.get('[data-testid="name"]').first().contains("Simulator");
  });

  it("Advanced search create search", () => {
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
    cy.get('[data-testid="outlinedInput').eq(0).click().type(searchName);
    cy.get('[data-testid="outlinedInput').eq(1).click().type("Sample search");
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get('[data-testid="app"]').find('div').should("contain", "Search created successfully");
  });

  // error in continuous integration

  // it("Advanced search with Includes tags", () => {
  //   cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click({
  //     force: true,
  //   });
  //   cy.get('[data-testid="AutocompleteInput"]').first().click().type("Unread");
  //   cy.get(".MuiAutocomplete-option").first().click();
  //   cy.get('[data-testid="submitActionButton"]').click();
  // });
});
