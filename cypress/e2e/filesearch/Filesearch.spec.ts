describe('File search', () => {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit('/assistants');
  });

  it('should load file search page', () => {
    cy.get('[data-testid="headerTitle"]').should('contain', 'Assistants');
  });

  it('should create a new assistant', () => {
    cy.get('[data-testid="headingButton"]').click();
    cy.get('div').should('contain', 'Assistant created successfully');
  });
  it('changes the configuration for an assistant', () => {
    cy.get('[data-testid="listItem"]').first().click();

    cy.get('[data-testid=AutocompleteInput]').click().type('gpt');
    cy.get('.MuiAutocomplete-option').first().click({ force: true });

    cy.get('input[name=name]').first().type('{selectAll}');
    cy.get('input[name=name]').first().type('{backspace}');
    cy.get('input[name=name]').first().type('test assistant');
    cy.get('textarea[name=instructions]').first().type('This is an instruction');

    cy.get('[data-testid="addFiles"]').click();

    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.md', {
      force: true,
    });

    cy.get('div').should('contain', 'sample.md');

    cy.wait(500);

    cy.get('[data-testid="ok-button"]').click();
    cy.get('div').should('contain', 'Files added to assistant!');

    cy.get('[data-testid="submitAction"]').click();
    cy.get('div').should('contain', 'Changes saved successfully');
  });

  it('should remove files and delete the assistant', () => {
    cy.get('[data-testid="listItem"]').first().click();

    cy.get('[data-testid="addFiles"]').click();
    cy.get('[data-testid="deleteFile"]').first().click();

    cy.get('[data-testid="ok-button"]').click();

    cy.get('[data-testid="removeAssistant"]').first().click();

    cy.get('[data-testid="ok-button"]').click();
    cy.get('div').should('contain', 'Assistant test assistant deleted successfully');
  });
});
