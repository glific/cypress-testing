describe('Login page', () => {
  const phone = Cypress.env('phone');
  const password = Cypress.env('password');

  it('Load the login page', () => {
    // fix for Error: ESOCKETTIMEDOUT
    cy.visit('/login');
    cy.get('h4').should('contain', 'Login to your account');
  });

  it('Check validations', () => {
    cy.visit('/login');
    cy.get('[data-testid="SubmitButton"]').click();
    cy.get('p').should('contain', 'Input required');
  });

  it('Redirect to forgot password form', () => {
    cy.visit('/login');
    cy.contains('Forgot Password?').click();
    cy.get('h4').should('contain', 'Reset your password');
  });

  it('Redirect to Registration form', () => {
    cy.visit('/login');
    cy.contains('Create a new account').click();
    cy.get('h4').should('contain', 'Create your new account');
  });

  // some issue in this case, need to check
  it('Successful login', () => {
    cy.visit('/login');
    cy.get('input[type=tel]').type(phone);
    cy.get('input[type=password]').type(password);
    cy.get('[data-testid="SubmitButton"]').click();
    cy.get('div').should('contain', 'Chats');
  });
});
