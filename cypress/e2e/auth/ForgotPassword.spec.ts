describe('Forgot password page', () => {
  const phone = Cypress.env('phone');

  it('Load the forgot password page', () => {
    cy.visit('/resetpassword-phone');
    cy.get('h4').should('contain', 'Reset your password');
  });

  it('Check validations', () => {
    cy.visit('/resetpassword-phone');
    cy.get('[data-testid="SubmitButton"]').click();
    cy.get('p').should('contain', 'Input required');
  });

  it('Successful otp send', () => {
    cy.visit('/resetpassword-phone');
    cy.get('input[type=tel]').type(phone);
    cy.get('[data-testid="SubmitButton"]').click();
    cy.get('div').should('contain', 'Please confirm the OTP received at your WhatsApp number.');
  });
});
