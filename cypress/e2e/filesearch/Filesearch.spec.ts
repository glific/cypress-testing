describe('File search', () => {
  const assistantName = `Test Assistant ${+new Date()}`;
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit('/assistants');
  });

  it('should load file search page', () => {
    cy.get('[data-testid="headerTitle"]').should('contain', 'Assistants');
  });

  //TODO: enable these tests after fixing the file upload issue

  it.skip('should create a new assistant', () => {
    cy.get('[data-testid="headingButton"]').click();
    cy.get('input[name=name]').first().type(assistantName);
    cy.get('textarea[name=instructions]').first().type('This assistant is for searching files.\n');
    cy.get('[data-testid=autocomplete-element]')
      .type('gpt-3.5-turbo' + '{enter}')
      .type('{downArrow}')
      .type('{enter}')
      .wait(500);

    cy.get('[data-testid="submitAction"]').click();

    cy.get('div').should('contain', 'Assistant created successfully');
  });
  it.skip('changes the configuration for an assistant', () => {
    cy.get('input[name=searchInput]').type(`${assistantName}` + '{enter}');

    cy.get('[data-testid="listItem"]').first().click();
    cy.get('input[name=name]').first().type(' updated');
    cy.get('textarea[name=instructions]').first().type('This is an instruction.\n');

    cy.get('[data-testid="expandIcon"]').click();
    cy.get('textarea[name=expand-instructions]').first().type('This is another instruction.');
    cy.get('[data-testid="save-button"]').click();

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

  it.skip('should remove files and delete the assistant', () => {
    cy.get('input[name=searchInput]').type(`${assistantName} updated` + '{enter}');

    cy.get('[data-testid="listItem"]').first().click();

    cy.get('[data-testid="removeAssistant"]').first().click();

    cy.get('[data-testid="ok-button"]').click();
    cy.get('div').should('contain', `Assistant ${assistantName} updated deleted successfully`);
  });
});
