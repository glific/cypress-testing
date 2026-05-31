describe('Role - Staff - Blocked Contact', () => {
  beforeEach(function () {
    cy.appLogin(Cypress.env('staff').phone, Cypress.env('staff').password);
    cy.visit('/blocked-contacts');
  });

  it('should load blocked contacts list', () => {
    cy.get('[data-testid="listHeader"]').should('contain', 'Blocked contacts');
  });
});
