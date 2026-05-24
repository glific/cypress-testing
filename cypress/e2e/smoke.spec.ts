describe('smoke test', () => {
  let testPassed = true;

  afterEach(function () {
    if (this.currentTest?.state === 'failed') {
      testPassed = false;
    }
  });

  after(() => {
    cy.env(['INSTATUS_API_KEY', 'INSTATUS_PAGE_ID', 'INSTATUS_COMPONENT_ID']).then(
      ({ INSTATUS_API_KEY, INSTATUS_PAGE_ID, INSTATUS_COMPONENT_ID }) => {
        const status = testPassed ? 'OPERATIONAL' : 'MAJOROUTAGE';
        cy.request({
          method: 'PUT',
          url: `https://api.instatus.com/v2/${INSTATUS_PAGE_ID}/components/${INSTATUS_COMPONENT_ID}`,
          headers: { Authorization: `Bearer ${INSTATUS_API_KEY}` },
          body: { status },
          failOnStatusCode: false,
        });
      }
    );
  });

  it('passes', () => {
    cy.env([
      'SMOKE_TEST_CHAT_URL',
      'SMOKE_TEST_LOGIN_PHONE_NUMBER',
      'SMOKE_TEST_LOGIN_PASSWORD',
    ]).then(({ SMOKE_TEST_CHAT_URL, SMOKE_TEST_LOGIN_PHONE_NUMBER, SMOKE_TEST_LOGIN_PASSWORD }) => {
      cy.visit(SMOKE_TEST_CHAT_URL);
      cy.get('[data-testid="phoneInput"] [name="phoneNumber"]').click();
      cy.get('[data-testid="phoneInput"] [name="phoneNumber"]').type(SMOKE_TEST_LOGIN_PHONE_NUMBER);
      cy.get('[data-testid="outlinedInput"] [name="password"]').click();
      cy.get('[data-testid="outlinedInput"] [name="password"]').click();
      cy.get('[data-testid="outlinedInput"] [name="password"]').type(SMOKE_TEST_LOGIN_PASSWORD);
      cy.get('[data-testid="SubmitButton"]').click();
      cy.get('[data-testid="dropdownIcon"]', { timeout: 10000 }).should('be.visible').click();
      cy.get('[data-testid="flowButton"]', { timeout: 10000 }).should('be.visible').click();

      cy.get('div[data-testid="AutocompleteInput"]', { timeout: 10000 })
        .should('be.visible')
        .within(() => {
          cy.get('input').type('smoke-test');
        });
      cy.get('ul.MuiAutocomplete-listbox')
        .first()
        .within(() => {
          cy.get('li').first().click();
        });

      cy.get('[data-testid="ok-button"]').click();

      // Wait for 30 seconds to ensure all messages are in
      cy.wait(30000);

      cy.get('[data-testid="messageContainer"] [data-testid="content"]', { timeout: 10000 }).then(
        ($messages) => {
          expect($messages.length).to.be.at.least(3);
          const lastThree = $messages.slice(-3);

          // First of last three should have the date message
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const dateString = `World! ${day}/${month}/${year}`;
          expect(Cypress.$(lastThree[0]).text()).to.contain(dateString);

          // Second should have 'elephant'
          expect(Cypress.$(lastThree[1]).text()).to.contain('elephant');

          // Third should have an audio element inside
          expect(Cypress.$(lastThree[2]).find('audio').length).to.be.greaterThan(0);
        }
      );
    });
  });
});
