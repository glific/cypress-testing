describe('Notification list ', () => {
  beforeEach(function () {
    cy.login();
    cy.visit('/notifications');
  });

  it('should show Notifications in sidebar', () => {
    cy.get('[data-testid=list]').should('contain', 'Notifications');
  });

  it('should load notification list', () => {
    cy.get('[data-testid="listHeader"]').should('contain', 'Notifications');
    cy.get('[data-testid="tableBody"]').should('not.be.empty');
  });

  it('should show copy text and view menu after clicking entity ', () => {
    //   check if notifications are there
    cy.get('[data-testid="tableBody"]')
      .should('not.be.empty')
      .then(function () {
        cy.get('[data-testid="tableBody"] > tr > td > [data-testid=Menu]:first > div').click({
          force: true,
        });
        cy.get('[data-testid=MenuItem]').should('contain', 'Copy text');
        cy.get('[data-testid=MenuItem]').should('contain', 'View');
        cy.get('[data-testid="tableBody"] > tr > td > [data-testid=Menu]:first').click({
          force: true,
        });
        cy.get('[data-testid=MenuItem]').should('contain', 'Copy text');
        cy.get('[data-testid=MenuItem]').should('contain', 'View').last().click({ force: true });
        cy.contains('Done').click();
      });
  });

  it('arrow should redirect to contact for category message ', () => {
    // select Warning filter as well to get all notifications
    cy.get('input[value=Warning]').click();
    cy.get('[data-testid="tableBody"]')
      .should('not.be.empty')
      .then(function () {
        cy.get('[data-testid=table]').contains('td', 'Message').next().next().next().next().click();
      });
  });

  it('arrow should redirect to particular flow for category flow ', () => {
    cy.get('input[value=Warning]').click();
    cy.get('[data-testid="tableBody"]')
      .should('not.be.empty')
      .then(function () {
        cy.get('[data-testid=table]').contains('td', 'Flow').next().next().next().next().click();
      });
  });

  it('downloads csv report for contact import', () => {
    cy.visit('/notifications');
    cy.get('[data-testid="additionalButton"]').first().click();
    cy.get('div').should('contain', 'Downloaded the status of the contact upload');
  });
});
