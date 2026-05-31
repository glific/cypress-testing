describe('Role - Staff - Chats', () => {
  beforeEach(function () {
    cy.appLogin(Cypress.env('staff').phone, Cypress.env('staff').password);
    cy.visit('/chat');
    cy.wait(500);
  });

  it('should search in chat search', () => {
    cy.get('[data-testid="searchInput"]').wait(500).type('Simulator');
  });

  it('Select searched contact', () => {
    cy.get('[data-testid="searchInput"]').wait(500).type('Glific Simulator One');

    cy.wait(1000);
    cy.get('[data-testid="name"]').first().should('contain', 'Glific Simulator One');

    cy.get('h6').should('contain', 'Glific Simulator One');
  });

  it('Advanced search with name/tag/keyword', () => {
    cy.get('.MuiInputAdornment-root > .MuiButtonBase-root').click();
    cy.wait(1000);
    cy.get('[data-testid="input"]').first().click().wait(500).type('Glific Simulator One');
    cy.get('[data-testid="submitActionButton"]').click();
    cy.wait(1000);
    cy.get('[data-testid="name"]').first().should('contain', 'Glific Simulator One');
  });
});
