describe('Role - Staff - Chats', () => {
  const searchName = 'Col' + +new Date();
  beforeEach(function () {
    // login before each test
    cy.appLogin(Cypress.env('staff').phone, Cypress.env('staff').password);
    cy.visit('/chat');
    cy.wait(500);
  });

  it('should search in chat search', () => {
    cy.get('[data-testid="searchInput"]').click({ force: true }).wait(500).type('Simulator');
  });

  it('Select searched contact', () => {
    cy.get('[data-testid="searchInput"]')
      .click({ force: true })
      .wait(500)
      .type('Glific Simulator One');

    cy.wait(1000);
    cy.get('[data-testid="name"]')
      .first()
      .should('contain', 'Glific Simulator One')
      .click({ force: true });

    cy.get('h6').should('contain', 'Glific Simulator One');
  });

  it('Advanced search with name/tag/keyword', () => {
    cy.get('.MuiInputAdornment-root > .MuiButtonBase-root').click({
      force: true,
    });
    cy.wait(1000);
    cy.get('[data-testid="input"]').first().click().wait(500).type('Glific Simulator One');
    cy.get('[data-testid="submitActionButton"]').click();
    cy.wait(1000);
    cy.get('[data-testid="name"]').first().should('contain', 'Glific Simulator One');
  });

  // replacing tags with labels

  // it("Advanced search with Includes tags", () => {
  //   cy.wait(1000);
  //   cy.get(".MuiInputAdornment-root > .MuiButtonBase-root").click({
  //     force: true,
  //   });
  //   cy.get('[data-testid="AutocompleteInput"]').first().click();
  //   cy.wait(500);
  //   cy.get(".MuiAutocomplete-option").first().click({ force: true });
  //   cy.get('[data-testid="submitActionButton"]').click();
  //   cy.wait(500);
  //   cy.get(".contactsContainer > ul").then((item) => {
  //     // if empty results found
  //     if (item.find('[data-testid="empty-result"]').length) {
  //       cy.contains(
  //         '[data-testid="empty-result"]',
  //         "Sorry, no results found! Please try a different search."
  //       );
  //     }
  //   });
  // });
});
