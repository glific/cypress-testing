describe('template spec', () => {
  let testPassed = true;

  afterEach(function () {
    if (this.currentTest?.state === 'failed') {
      testPassed = false;
    }
  });

  after(() => {
    cy.env(['instatusApiKey', 'instatusPageId', 'instatusComponentId']).then(
      ({ instatusApiKey, instatusPageId, instatusComponentId }) => {
        const status = testPassed ? 'OPERATIONAL' : 'MAJOROUTAGE';
        cy.request({
          method: 'PUT',
          url: `https://api.instatus.com/v2/${instatusPageId}/components/${instatusComponentId}`,
          headers: { Authorization: `Bearer ${instatusApiKey}` },
          body: { status },
          failOnStatusCode: false,
        });
      }
    );
  });

  it('passes', () => {
    cy.env(['smokeTestChatUrl', 'smokeTestLoginPhoneNumber', 'smokeTestLoginPassword']).then(
      ({ smokeTestChatUrl, smokeTestLoginPhoneNumber, smokeTestLoginPassword }) => {
        cy.visit(smokeTestChatUrl);
        cy.get('[data-testid="phoneInput"] [name="phoneNumber"]').click();
        cy.get('[data-testid="phoneInput"] [name="phoneNumber"]').type(smokeTestLoginPhoneNumber);
        cy.get('[data-testid="outlinedInput"] [name="password"]').click();
        cy.get('[data-testid="outlinedInput"] [name="password"]').click();
        cy.get('[data-testid="outlinedInput"] [name="password"]').type(smokeTestLoginPassword);
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

        // Get the last 3 messages
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
      }
    );
  });
});
