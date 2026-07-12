describe('Flow smoke test', () => {
  after(() => {
    const tests = Cypress.mocha.getRunner().suite.tests;
    const passed = tests.length > 0 && tests.every((t) => t.state === 'passed');
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

      // The simulator keeps the full chat history for the "Beneficiary" contact, so
      // bubbles from previous runs (including their terminal message) are still
      // present. The flow saves `execution_time` at its first node as the server UTC
      // minute (`DateTime.utc_now() |> Calendar.strftime("%d-%m-%Y %H:%M")`) and echoes
      // it in the first ("Test on - <time>") and last ("Test Finished - <time>")
      // messages of the run. We regenerate that minute locally so we validate THIS
      // run, never a stale one. Allow ±1 minute to absorb the click→server-capture
      // gap, minute boundaries, and small CI↔server clock skew; a ±1 min window never
      // collides with a twice-hourly stale run.
      const fmt = (d: Date): string => {
        const p = (n: number): string => String(n).padStart(2, '0');
        return `${p(d.getUTCDate())}-${p(d.getUTCMonth() + 1)}-${d.getUTCFullYear()} ${p(
          d.getUTCHours()
        )}:${p(d.getUTCMinutes())}`;
      };
      const now = Date.now();
      const candidates = [-60000, 0, 60000].map((offset) => fmt(new Date(now + offset)));
      const escaped = candidates.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const finishedRe = new RegExp(`Test Finished - (${escaped.join('|')})`);

      // The full flow is slow — wait (retrying) for THIS run's unique finish marker.
      cy.contains('[data-testid="simulatorMessage"]', finishedRe, { timeout: 180000 }).should(
        'exist'
      );
      cy.get('[data-testid="simulatedMessages"]')
        .find('[data-testid="simulatorMessage"]')
        .then(($messages) => {
          // Anchor on the last matching "Test Finished" bubble and take the 7 bubbles
          // of that run. Bounding the slice with the same timestamp on both ends means
          // a truncated/failed run (which jumps straight to "Test Finished") fails the
          // "Test on" assertion instead of borrowing a prior run's bubbles.
          let endIdx = -1;
          let execTime = '';
          $messages.each((i, el) => {
            const match = Cypress.$(el).text().match(finishedRe);
            if (match) {
              endIdx = i;
              [, execTime] = match;
            }
          });
          expect(endIdx, 'index of the "Test Finished" message').to.be.gte(6);
          const responses = $messages.slice(endIdx - 6, endIdx + 1);

          // Response 1: run start marker
          cy.wrap(responses[0]).within(() => {
            cy.get('audio').should('not.exist');
            cy.get('span').first().should('have.text', `Test on - ${execTime}`);
          });
          // Response 2: filesearch-gpt answer
          cy.wrap(responses[1]).within(() => {
            cy.get('audio').should('not.exist');
            cy.get('span')
              .first()
              .invoke('text')
              .should((text) => {
                expect(text.toLowerCase()).to.include('elephant');
              });
          });
          // Response 3: text_to_speech audio
          cy.wrap(responses[2]).within(() => {
            cy.get('[data-testid="audioMessage"]').should('exist');
          });
          // Response 4: speech_to_text transcription
          cy.wrap(responses[3]).within(() => {
            cy.get('audio').should('not.exist');
            cy.get('span')
              .first()
              .invoke('text')
              .should((text) => {
                expect(text.toLowerCase()).to.include('homework');
              });
          });
          // Response 5: parse_via_gpt_vision result
          cy.wrap(responses[4]).within(() => {
            cy.get('audio').should('not.exist');
            cy.get('span')
              .first()
              .invoke('text')
              .should((text) => {
                expect(text.toLowerCase()).to.include('hibiscus');
              });
          });
          // Response 6: voice-filesearch-gpt audio
          cy.wrap(responses[5]).within(() => {
            cy.get('[data-testid="audioMessage"]').should('exist');
          });
          // Response 7: run finish marker (same timestamp as the start marker)
          cy.wrap(responses[6]).within(() => {
            cy.get('audio').should('not.exist');
            cy.get('span').first().should('have.text', `Test Finished - ${execTime}`);
          });
        });
    });
  });
});
