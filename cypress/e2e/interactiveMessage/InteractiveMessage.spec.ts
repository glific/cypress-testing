describe('Interactive message quick reply', () => {
  const interactiveMessageTitle = 'Sample interactive message ' + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit('/interactive-message');
  });

  it('should create new quick reply', () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(500); //It's not the best way to wait for the dom to load, we need to find a better solution.
    cy.get('input[name=title]').click().type(interactiveMessageTitle);

    cy.get('.DraftEditor-editorContainer').click({ force: true }).type('Test interactive message');

    cy.get("button[data-testid='addButton']").as('addNewButton');
    cy.get('@addNewButton').click();
    cy.get('@addNewButton').click();

    cy.get("div[data-testid='textField'] input").eq(0).click().type('Button 1');
    cy.get("div[data-testid='textField'] input").eq(1).click().type('Button 2');
    cy.get("div[data-testid='textField'] input").eq(2).click().type('Button 3');

    cy.get('[data-testid="submitActionButton"]').click();
    cy.get('div').should('contain', 'Interactive msg created successfully!');
  });

  it('should load interactive message list', () => {
    cy.get("p[data-testid='label'").contains(interactiveMessageTitle);
  });

  it('should edit quick reply', () => {
    cy.get('input[name=searchInput]')
      .click()
      .wait(1000) //It's not the best way to wait for the dom to load, we need to find a better solution.
      .type(interactiveMessageTitle + '{enter}');
    cy.get('[data-testid=EditIcon]').click();

    cy.get("div[data-testid='textField'] input").eq(0).click().type('3');

    cy.get('[data-testid="submitActionButton"]').click();
    cy.get('div').should('contain', 'Interactive msg edited successfully!');
  });

  it('should delete quick reply message', () => {
    cy.wait(500);
    cy.get('input[name=searchInput]')
      .click()
      .wait(1000) //It's not the best way to wait for the dom to load, we need to find a better solution.
      .type(interactiveMessageTitle + '{enter}');
    cy.get('[data-testid=DeleteIcon]').click();
    cy.get('[data-testid=ok-button]').click();
    cy.get('div').should('contain', 'Interactive deleted successfully');
  });
});
