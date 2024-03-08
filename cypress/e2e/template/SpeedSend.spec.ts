describe('Speed Send', () => {
  const speedSendName = 'Sample SpeedSend_' + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit('/speed-send');
  });

  it('should load speed send list', () => {
    cy.get('[data-testid="listHeader"]').should('contain', 'Speed sends');
  });

  it('should check validation', () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(1000);
    cy.get('[data-testid="submitActionButton"]').click();
    cy.contains('Title is required.');
    cy.contains('Message is required.');
  });

  it('should create new speed send', () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.get('input[name=label]').click().wait(500).type(speedSendName);
    cy.get('[data-testid="editor-body"]').click({ force: true }).type('Test speed send message');
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get('div').should('contain', 'Speed send created successfully');
  });

  it('should edit speed send', () => {
    cy.get('input[name=searchInput]')
      .click()
      .wait(500)
      .type(speedSendName + '{enter}');

    cy.get('[data-testid="tableBody"]')
      .should('not.be.empty')
      .then(function () {
        cy.get('[data-testid=EditIcon]').click();
        cy.get('[data-testid="AutocompleteInput"]').first().click();
        cy.get('.MuiAutocomplete-option').eq(0).click();
        cy.get('[data-testid="editor-body"]')
          .click({ force: true })
          .type('Dummy speed send message');
        cy.get('input[name=attachmentURL]')
          .click({ force: true })
          .type('https://www.buildquickbots.com/whatsapp/media/sample/jpg/sample01.jpg');
        cy.get('[data-testid="submitActionButton"]').click();
        cy.get('div').should('contain', 'Speed send edited successfully');
      });
  });

  it('should show all languages', () => {
    cy.get('[data-testid="tableBody"]')
      .should('not.be.empty')
      .then(function () {
        cy.get('input[name=searchInput]')
          .click()
          .wait(500)
          .type(speedSendName + '{enter}');
        cy.get('[data-testid=additionalButton] :first').click();
      });
  });

  it('should delete speed send', () => {
    cy.get('input[name=searchInput]')
      .click()
      .wait(500)
      .type(speedSendName + '{enter}');
    cy.get('[data-testid="tableBody"]')
      .should('not.be.empty')
      .then(function () {
        cy.get('[data-testid=MoreIcon]').click();
        cy.get('[data-testid=DeleteIcon]').click();
        cy.contains('Confirm').click();
        cy.get('div').should('contain', 'Speed send deleted successfully');
      });
  });
});
