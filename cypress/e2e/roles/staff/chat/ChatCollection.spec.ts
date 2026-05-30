describe('Role - Staff - ChatCollection', () => {
  before(function () {
    cy.appLogin(Cypress.env('staff').phone, Cypress.env('staff').password);
    cy.addContactToCollection();
  });

  beforeEach(function () {
    cy.visit('/chat/collection');
    cy.contains('a[data-testid="list"] [data-testid="name"]', 'Default Group').click();
  });

  it('should send the message to collection', () => {
    cy.sendTextMessage('collection');
  });
});
