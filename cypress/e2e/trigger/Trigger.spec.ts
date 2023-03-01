export const selectFromInput = (elementPosition, optionPosition) => {
  cy.get('[data-testid="AutocompleteInput"]').eq(elementPosition).click().wait(500);
  cy.get('.MuiAutocomplete-option').eq(optionPosition).click();
};

const dayjs = require('dayjs');

describe('Triggers (daily) ', () => {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit('/trigger');
  });

  it('should create new trigger', () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(500);

    // select first flow from list
    selectFromInput(0, 0);

    cy.get('[data-testid="date-picker-inline"] .MuiOutlinedInput-root').eq(0).click();

    cy.get('button[title="Next month"]').first().click();

    cy.get('button.MuiPickersDay-root').last().click();

    cy.get('[data-testid="date-picker-inline"] .MuiOutlinedInput-root').eq(1).click();

    cy.get('button[title="Next month"]').first().click();
    cy.get('button[title="Next month"]').first().click();
    cy.get('button[title="Next month"]').first().click();

    cy.get('button.MuiPickersDay-root').first().click();
    //select start time
    cy.get('[data-testid="time-picker"]').click();

    // cy.get('button').contains('AM').click({ force: true });

    cy.get('.MuiClock-squareMask').click({ force: true });
    cy.wait(1000);
    cy.get('.MuiClock-squareMask').click({ force: true });

    // select repeat as (does not repeat)
    selectFromInput(1, 0);

    // select the first collection
    selectFromInput(3, 0);

    // save trigger
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get('div').should('contain', 'Trigger created successfully!');
  });
});
