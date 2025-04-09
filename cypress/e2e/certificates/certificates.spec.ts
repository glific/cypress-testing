describe('Certificates', () => {
  const slidesLink =
    'https://docs.google.com/presentation/d/1gOEVtZFWHhRWrKgdHPlfDrkiTnE56Pfxf6_GkLaolqk/edit?slide=id.gc6f9fe735_0_0#slide=id.gc6f9fe735_0_0';

  beforeEach(() => {
    cy.login();
    cy.visit('/certificates');
  });

  it('should open certificates page', () => {
    cy.get('div').should('contain', 'Certificates');
  });

  it('should open create a certificate', () => {
    cy.get('[data-testid="newItemButton"]').first().click();

    cy.get('input[name=title]').click().type('Sample');
    cy.get('textarea[name=description]').click().type('Description for the certificate.\n');
    cy.get('input[name=url]').click().type(slidesLink);

    cy.get('[data-testid="submitActionButton"]').first().click();
    cy.get('div').should('contain', 'Certificate created successfully!');
  });

  it('should edit certificate', () => {
    cy.get('[data-testid=EditIcon]').first().click();

    cy.get('input[name=title]').click().type(' Certificate');
    cy.get('textarea[name=description]').click().type('This is what the certificate is about');

    cy.get('[data-testid="submitActionButton"]').first().click();
    cy.get('div').should('contain', 'Certificate edited successfully!');
  });

  it('should delete certificate', () => {
    cy.get('[data-testid=MoreIcon]').click();
    cy.get('[data-testid=DeleteIcon]').click();

    cy.get('[data-testid="ok-button"]').first().click();
    cy.get('div').should('contain', 'Certificate deleted successfully');
  });
});
