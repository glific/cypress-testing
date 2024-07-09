describe('Role - Staff - Collection', () => {
  const collectionName = 'Restricted Group';

  beforeEach(function () {
    // login before each test
    cy.appLogin(Cypress.env('staff').phone, Cypress.env('staff').password);
    cy.visit('/collection');
  });

  // issue in navigation
  // it("should edit collection", () => {
  //   cy.get("input[name=searchInput]")
  //     .click()
  //     .wait(500) //It's not the best way to wait for the dom to load, we need to find a better solution.
  //     .type(collectionName + "{enter}");
  //   cy.get("[data-testid=EditIcon]").click();
  //   cy.get('[data-testid="submitActionButton"]').click();
  //   cy.get("div").should("contain", "Collection edited successfully!");
  // });

  it('should add member to collection', () => {
    cy.get('input[name=searchInput]').type(collectionName + '{enter}');
    cy.get('[data-testid=additionalButton]').eq(0).click();
    cy.get('[data-testid=AutocompleteInput]')
      .scrollIntoView()
      .type('Default receiver' + '{enter}')
      .wait(500);
    cy.get('.MuiAutocomplete-option').first().click({ force: true });
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get('div').should('contain', '1 contact added');
  });

  it('should remove member from collection', () => {
    cy.get('input[name=searchInput]').type(collectionName + '{enter}');
    cy.get('[data-testid=view]').click();
    cy.get('input[name=searchInput]')
      .type('Default receiver' + '{enter}')
      .wait(1000);
    cy.get('[type="checkbox"]').check();
    if (cy.get('[data-testid="deleteBtn"]')) {
      cy.get('[data-testid="deleteBtn"]').first().click({ force: true });
      cy.get('[data-testid="ok-button"]').click({ force: true });
      cy.get('div').should('contain', 'Contact has been removed successfully from the collection.');
    }
  });
});
