describe('Registration page', () => {
  const phone = Cypress.env('phone');
  const password = Cypress.env('password');

  it('Load the forgot password page', () => {
    cy.visit('/registration');
    cy.get('span').should('contain', 'Register with ');
  });

  it('Register button should be disabled by default', () => {
    cy.get('[data-testid="SubmitButton"]').should('have.attr', 'disabled');
  });

  it('Should be able to enter the values in form', () => {
    cy.get('input[type=text]').type('Test User');
    cy.get('input[type=tel]').type(phone);
    cy.get('input[type=password]').type(password);

    cy.get('input[type=text]').should('have.attr', 'value', 'Test User');
    cy.get('input[type=tel]').should('have.attr', 'value', '+91' + phone);
    cy.get('input[type=password]').should('have.attr', 'value', password);
  });
});
