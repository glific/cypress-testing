describe("Message", () => {
  beforeEach(function () {
    // login before each
    cy.login();
    cy.visit("/chat");
  });
  it("should tag a message", () => {
    cy.get('[data-testid="beneficiaryName"]').then((body) => {
      if (body[0].innerText !== "Simulator") {
        cy.get('[data-testid="simulatorIcon"]').click();
        cy.get("#simulator");
      }
    });
    cy.get("[data-testid=simulatorInput]")
      .click()
      .wait(500)
      .type("hi" + "{enter}");
    const old_tag_count = cy.get('[data-testid="tags"]').last().its("length");
    cy.get('[data-testid="messageOptions"]').last().wait(500).click();
    cy.contains("Assign tag").click();
    cy.get('[title="Open"]').wait(500).click();
    cy.get(".MuiAutocomplete-popper").wait(500).first().click();
    cy.get('[title="Close"]').wait(500).click();
    cy.get('[data-testid="ok-button"]').click().wait(500);
    const new_tag_count = cy.get('[data-testid="tags"]').last().its("length");
    expect(new_tag_count).to.not.equal(old_tag_count);
  });
});
