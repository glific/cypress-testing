describe('Role - Staff - Contact bar', function () {
  beforeEach(function () {
    cy.appLogin(Cypress.env('staff').phone, Cypress.env('staff').password);
    cy.visit('/chat');
    cy.wait(500);
  });

  it('should add to collection', () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    if (cy.get('[data-testid="collectionButton"]')) {
      cy.get('[data-testid="collectionButton"]').click({ force: true });
      cy.wait(500);
      cy.get('[data-testid="autocomplete-element"]').then((group) => {
        if (group.find('[data-testid="searchChip"]').length) {
          cy.get('[data-testid="searchChip"] > span').each((chip) => {
            if (chip[0].innerText == 'Restricted Group') {
              cy.get('[data-testid=ok-button]').click({ force: true });
            }
          });
        } else {
          cy.get('[data-testid="autocomplete-element"]').click().type('Restricted Group');
          cy.get('.MuiAutocomplete-popper').click();
          cy.get('[data-testid=ok-button]').click({ force: true });
          cy.wait(500);
          cy.get('[data-testid="app"]').find('div').should('contain', 'Added to 1 collection');
          cy.wait(500);
          cy.get('[data-testid="collectionNames"]').should('contain', 'Restricted Group');
        }
      });
    }
  });

  it('should remove from collection', () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    if (cy.get('[data-testid="collectionButton"]')) {
      cy.get('[data-testid="collectionButton"]').click({ force: true });
      cy.wait(500);
      cy.get('[data-testid="autocomplete-element"]').then((group) => {
        if (group.find('[data-testid="searchChip"]').length) {
          cy.get('[data-testid="searchChip"]').each((chip) => {
            const grpTxt = chip.find('span');
            if (grpTxt[0].innerText == 'Restricted Group') {
              cy.wait(500);
              cy.wrap(chip).find('svg').click({ force: true });
              cy.get('[data-testid=ok-button]').click({ force: true });
              cy.wait(500);
              cy.get('[data-testid="app"]')
                .find('div')
                .should('contain', 'Removed from 1 collection');
            }
          });
        } else {
          cy.get('[data-testid=ok-button]').click({ force: true });
        }
      });
    }
  });
});
