describe('Flow smoke test', () => {
  after(function () {
    const passed =
      this.tests.length > 0 && this.tests.every((test) => test.state === 'passed');
    cy.task('reportInstatus', passed);
  });

  it('runs smoke-test flow and validates simulator responses', () => {
    cy.env(['smoke']).then(({ smoke }) => {
      cy.appLogin(smoke.phone, smoke.password, smoke.baseUrl);
      cy.visit(`${smoke.baseUrl.replace(/\/+$/, '')}/flow`);
      cy.get('[data-testid="searchInput"] [name="searchInput"]').click();
      cy.get('[data-testid="searchInput"] [name="searchInput"]').type('smoke-test{enter}');
      cy.get('[data-testid="tableBody"]').find('a').first().click();
      cy.get('[data-testid="previewButton"]').click();
      cy.get('[data-testid="simulatedMessages"]').should('be.visible');
      cy.wait(30000);
      cy.get('[data-testid="simulatedMessages"]')
        .find('[data-testid="simulatorMessage"]')
        .then(($messages) => {
          const lastThree = $messages.slice(-3);

          cy.wrap(lastThree[0]).within(() => {
            cy.get('audio').should('not.exist');
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            const formattedDate = `${dd}/${mm}/${yyyy}`;
            cy.get('span').first().should('have.text', `Hello World! ${formattedDate}`);
          });
          cy.wrap(lastThree[1]).within(() => {
            cy.get('audio').should('not.exist');
            cy.get('span')
              .first()
              .invoke('text')
              .should((text) => {
                expect(text.toLowerCase()).to.include('elephant');
              });
          });

          cy.wrap(lastThree[2]).within(() => {
            cy.get('[data-testid="audioMessage"]').should('exist');
          });
        });
    });
  });
});
