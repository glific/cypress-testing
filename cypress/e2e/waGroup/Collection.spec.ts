describe('Groups Collection', () => {
  const collectionName = 'WhatsApp Group Sample Collection ' + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit('/group/collection');
  });

  it('should create new collection', () => {
    cy.create_collection(collectionName, true);
  });

  it('should edit collection', () => {
    cy.wait(500);
    cy.get('[data-testid=EditIcon]').first().click();
    cy.get('[data-testid="submitActionButton"]').first().click();
    cy.get('div').should('contain', 'Collection edited successfully!');
  });

  it('should add member to collection', () => {
    cy.wait(500);
    cy.get('[data-testid=additionalButton]').eq(0).click();
    cy.get('[data-testid=autocomplete-element]').click();
    cy.get('.MuiAutocomplete-option').first().click();
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get('div').should('contain', '1 group added');
  });

  it('should remove member from collection', () => {
    cy.wait(500);
    cy.get('[data-testid=view]').first().click();
    cy.wait(1000);
    cy.get('[data-testid=MoreIcon]').click();
    cy.get('[data-testid="DeleteIcon"]').first().click({ force: true });
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get('div').should('contain', 'WaGroups deleted successfully');
  });

  it('should delete collection', () => {
    cy.wait(500);
    cy.get('[data-testid=MoreIcon]').first().click();
    cy.get('[data-testid=DeleteIcon]').click();
    cy.contains('Confirm').click();
    cy.get('div').should('contain', 'Collection deleted successfully');
  });
});
