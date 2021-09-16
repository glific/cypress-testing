describe("Triggers (daily) ", () => {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/trigger");
  });

  const selectFromInput = (elementPosition, optionPosition) => {
    cy.get('[data-testid="AutocompleteInput"]')
      .eq(elementPosition)
      .click()
      .wait(500);
    cy.get(".MuiAutocomplete-option").eq(optionPosition).click();
  };

  it("should create new quick reply", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(500);

    // select first flow from list
    selectFromInput(0, 0);

    //select start date
    cy.get('[data-testid="date-picker-inline"] .MuiOutlinedInput-input')
      .eq(0)
      .click()
      .type("09/16/2021");

    //select end date
    cy.get('[data-testid="date-picker-inline"] .MuiOutlinedInput-input')
      .eq(1)
      .click()
      .type("09/17/2021");

    //select start time
    cy.get('[data-testid="time-picker"] .MuiOutlinedInput-input')
      .click()
      .type("03:17 PM");

    // select repeat as (does not repeat)
    selectFromInput(1, 0);

    // select the first collection
    selectFromInput(3, 0);

    // save trigger
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("div").should("contain", "Trigger created successfully!");
  });
});
