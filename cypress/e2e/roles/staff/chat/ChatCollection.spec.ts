describe('Role - Staff - ChatCollection', () => {
  beforeEach(function () {
    cy.appLogin(Cypress.env('staff').phone, Cypress.env('staff').password);
    cy.visit('/chat');
    cy.wait(1000);
    cy.get('[data-testid="searchInput"]').click({ force: true }).wait(500).type('Glific Simulator').wait(1000);
    cy.get("div[data-testid='listingContainer'] > ul").find('a').first().click();
    cy.addContactToCollection();
    cy.visit('/chat/collection');
    cy.wait(500);
  });

  it('should send the message to collection', () => {
    cy.wait(1000);
    cy.get("div[data-testid='chatInfo']").first().click();
    cy.sendTextMessage('collection');
  });
});
