describe("Flow", () => {
  beforeEach(function () {
    cy.login();
    cy.visit("/chat");

    cy.wait(500);
    cy.get('[data-testid="layout"]').then((body) => {
      if (body.find('[data-testid="clearIcon"]').length <= 0) {
        cy.get('[data-testid="simulatorIcon"]').click();
      }
    });
  });

  it("Test DG new contact flow", () => {
    cy.get('[data-testid="layout"]').then((body) => {
      // if (body.find('[data-testid="beneficiaryName"]').length < 0) {
      cy.get("[data-testid=simulatorInput]")
        .click()
        .type("dgnewcontact" + "{enter}");
      cy.wait(1000);
      cy.get("[data-testid=simulatedMessages]").should(
        "contain",
        "Your language is currently set at English"
      );
      cy.get("[data-testid=simulatorInput]")
        .click()
        .type("2" + "{enter}");
      cy.wait(1000);
      cy.get("[data-testid=simulatedMessages]").should(
        "contain",
        "Welcome to our NGO bot."
      );
      cy.get("[data-testid=simulatorInput]")
        .click()
        .type("1" + "{enter}");
      cy.wait(1000);
      cy.get("[data-testid=simulatedMessages]").should(
        "contain",
        "Thank you for giving us the permission. We really appreciate it."
      );
      cy.get("[data-testid=simulatedMessages]").should("contain", "Leaf curl");
      cy.get("[data-testid=simulatedMessages]").should(
        "contain",
        "Are you seeing any leaf curl symptoms in your chilli crop as shown in the above image?"
      );
      cy.get("[data-testid=simulatorInput]")
        .click()
        .type("yes" + "{enter}");
      cy.wait(1000);

      cy.get("[data-testid=simulatedMessages]").should(
        "contain",
        "Tell us if your crop is in any of the following stages "
      );

      cy.get("[data-testid=simulatorInput]")
        .click()
        .type("1" + "{enter}");
      cy.wait(1000);

      cy.get("[data-testid=simulatedMessages]").should(
        "contain",
        "Leaf Curl Symptoms = @contact.fields.leafcurlsymptom"
      );
      cy.wait(1000);
      cy.get("[data-testid=simulatorInput]")
        .click()
        .type("1" + "{enter}");
      cy.wait(1000);
    });
  });
});
