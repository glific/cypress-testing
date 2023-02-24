describe('Role - Staff - Contact bar', function () {
  const messageText = 'Sample Message for testing ' + +new Date();

  beforeEach(function () {
    // login before each test
    cy.appLogin(Cypress.env('staff').phone, Cypress.env('staff').password);
    cy.visit('/chat');
    cy.wait(500);
  });

  it('should view contact profile', () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    // For Simulator this option is disabled
    cy.get('[data-testid="beneficiaryName"]').then((body) => {
      if (!body[0].innerText.includes('Glific Simulator')) {
        cy.contains('View contact profile').click();
        cy.get('div').should('contain', 'Contact Profile');
      }
    });
  });

  it('should start a flow', () => {
    cy.get('[data-testid="searchInput"]').click({ force: true }).wait(500).type('Glific Simulator');
    cy.get('div[data-testid="listingContainer"] > ul').find('a').first().click();
    cy.startFlow();
  });

  it('should add to collection', () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    if (cy.get('[data-testid="collectionButton"]')) {
      cy.get('[data-testid="collectionButton"]').click({ force: true });
      cy.wait(500);
      cy.get('[data-testid="autocomplete-element"]').then((group) => {
        // check if Restricted Group is added or not, if not then add it, else skip
        if (group.find('[data-testid="searchChip"]').length) {
          cy.get('[data-testid="searchChip"] > span').each((chip) => {
            if (chip[0].innerText == 'Restricted Group') {
              cy.get('[data-testid=ok-button]').click({ force: true });
            }
          });
        } else {
          // if no collection is added, add Restricted Group
          cy.get('[data-testid="autocomplete-element"]').click().type('Restricted Group');
          cy.get('.MuiAutocomplete-popper').click();
          cy.get('[data-testid=ok-button]').click({ force: true });
          cy.wait(500);
          cy.get('[data-testid="app"]').find('div').should('contain', 'Added to 1 collection');
          // check collection name is showing under contact in chat window
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

  it('should block contact', function () {
    cy.get('[data-testid="beneficiaryName"]').then((body) => {
      if (!body[0].innerText.includes('Glific Simulator')) {
        cy.get('[data-testid="dropdownIcon"]').click();
        cy.get('[data-testid="blockButton"]').then((btn) => {
          if (btn[0]['disabled'] == false) {
            // other than Simulator
            cy.get('[data-testid="blockButton"]').click();
            cy.get('[data-testid="ok-button"]').click({ force: true });
            cy.wait(500);
            cy.get('[data-testid="app"]')
              .find('div')
              .should('contain', 'Contact blocked successfully')
              .wait(500);
            // undo Block contact after test
            cy.get('[data-testid=staffManagementMenu]').click({ force: true });
            cy.contains('Blocked contacts').click({ force: true });
            cy.get('[data-testid=additionalButton]').first().click();
            cy.get('[data-testid="ok-button"]').click();
            cy.wait(500);
            cy.get('[data-testid="app"]')
              .find('div')
              .should('contain', 'Contact unblocked successfully');
          }
        });
      }
    });
  });

  it('should clear conversations', () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    cy.contains('Clear conversation').click();
    cy.get('[data-testid="ok-button"]').click();
    cy.wait(500);
    cy.get('[data-testid="app"]')
      .find('div')
      .should('contain', 'Conversation cleared for this contact');
    // after checking a clear conversation, don't want to lose contact, so send a message.
    cy.get('.DraftEditor-editorContainer').click({ force: true });
    cy.get('.DraftEditor-editorContainer').type(messageText);
    cy.get('[data-testid="sendButton"]').click();
  });
});
