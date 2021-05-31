describe("Organization Settings", () => {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/settings");
  });

  it("should navigate to settings list", () => {
    cy.get("h5").should("contain", "Settings");
  });

  // it("should update languages in organization settings", () => {
  //   cy.get('[data-testid="organization"]')
  //     .find('[data-testid="EditIcon"]')
  //     .click();
  //   cy.wait(500);
  //   cy.get('[data-testid="autocomplete-element"]')
  //     .first()
  //     .click({ force: true })
  //     .type("Kan");
  //   cy.contains("Kannada").click();
  //   cy.get('[data-testid="submitActionButton"]').click();
  //   cy.get("div").should("contain", "Settings edited successfully!");
  // });

  it("should have valid available data", () => {
    cy.get('[data-testid="organization"]')
      .find('[data-testid="EditIcon"]')
      .click();
    cy.wait(500);

    cy.get('[data-testid="autocomplete-element"]')
      .first()
      .click({ force: true });

    cy.get('[data-testid="autocomplete-element"]').eq(1).click({ force: true });

    cy.get("h6").should("contain", "Hours of operations");

    cy.get('[data-testid="autocomplete-element"]')
      .eq(2)
      .click({ force: true })
      .type("Sun");
    cy.contains("Sunday");

    cy.get('[data-testid="time-picker"]')
      .first()
      .find("button")
      .click({ multiple: true, force: true });
    cy.get("h6").should("contain", "AM");
    cy.get("h6").should("contain", "PM");

    cy.get('[data-testid="time-picker"]')
      .eq(1)
      .find("button")
      .click({ multiple: true, force: true });
    cy.get("h6").should("contain", "AM");
    cy.get("h6").should("contain", "PM");
  });
});
