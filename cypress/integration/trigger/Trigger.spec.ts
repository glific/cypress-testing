export const selectFromInput = (elementPosition, optionPosition) => {
  cy.get('[data-testid="AutocompleteInput"]')
    .eq(elementPosition)
    .click()
    .wait(500);
  cy.get(".MuiAutocomplete-option").eq(optionPosition).click();
};

const dayjs = require("dayjs");

describe("Triggers (daily) ", () => {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/trigger");
  });

  it("should create new quick reply", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(500);

    // select first flow from list
    selectFromInput(0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startDate = dayjs(tomorrow).format("MM/DD/YYYY");
    tomorrow.setDate(tomorrow.getDate() + 2);

    const endDate = dayjs(tomorrow).format("MM/DD/YYYY");

    //select start date
    cy.get('[data-testid="date-picker-inline"] .MuiOutlinedInput-input')
      .eq(0)
      .click()
      .type(startDate);

    //select end date
    cy.get('[data-testid="date-picker-inline"] .MuiOutlinedInput-input')
      .eq(1)
      .click()
      .type(endDate);

    //select start time
    cy.get('[data-testid="time-picker"] .MuiOutlinedInput-input')
      .click()
      .type("11:59 PM");

    // select repeat as (does not repeat)
    selectFromInput(1, 0);

    // select the first collection
    selectFromInput(3, 0);

    // save trigger
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("div").should("contain", "Trigger created successfully!");
  });
});
