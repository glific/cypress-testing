describe('Forgot password page', () => {
  const phone = Cypress.env('phone');

  beforeEach(function () {
    cy.visit('/resetpassword-phone');
  });

  it('Load the forgot password page', () => {
    cy.get('h4').should('contain', 'Reset your password');
  });

  it('Check validations', () => {
    cy.get('[data-testid="SubmitButton"]').click();
    cy.get('p').should('contain', 'Input required');
  });

  it('Successful otp send', () => {
    cy.get('input[type=tel]').type(phone);
    cy.get('[data-testid="SubmitButton"]').click();
    cy.get('div').should('contain', 'Please confirm the OTP received at your WhatsApp number.');
  });
});
