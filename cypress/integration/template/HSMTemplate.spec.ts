describe("HSM Template", () => {
  const hsmTemplateName = "Sample HSM Templates " + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/template");
  });

  it("should load template list", () => {
    cy.get("h5").should("contain", "Templates");
  });

  it("should create new HSM template", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.get("[data-testid=formLayout] > :nth-child(2)").type("English");
    cy.contains("English").click();
    cy.get("input[name=label]").click().wait(500).type(hsmTemplateName);

    cy.get(":nth-child(4) > .MuiFormControl-root > [data-testid=outlinedInput]")
      .click({ force: true })
      .type("Test message");
    cy.get(":nth-child(5) > .MuiFormControl-root > [data-testid=outlinedInput]")
      .click({ force: true })
      .type("Test message");

    cy.get("[data-testid=formLayout] > :nth-child(6)").type("ACCOUNT_UPDATE");
    cy.contains("ACCOUNT_UPDATE").click();

    cy.get(
      ":nth-child(7) > .MuiFormControl-root > [data-testid=outlinedInput] > .MuiInputBase-input"
    )
      .click()
      .type("sample_templates");

    cy.get('[data-testid="submitActionButton"]').click();
    // It needs Gupshup setting enabled
    // cy.get(".MuiDialogContent-root").should("contain", "BSP response status");
    // cy.get("div").should("contain", "HSM Template created successfully");
  });

  // Currently to create hsm we need WhatsApp Business is Approved

  // it("should edit hsm template", () => {
  //   cy.get("input[name=searchInput]")
  //     .click()
  //     .wait(500)
  //     .type(hsmTemplateName + "{enter}");
  //   cy.get("[data-testid=EditIcon]").click();
  //   cy.get('[data-testid="submitActionButton"]').click();
  //   cy.get("div").should("contain", "HSM Template edited successfully");
  // });

  // it("should delete hsm template", () => {
  //   cy.get("input[name=searchInput]")
  //     .click()
  //     .wait(500)
  //     .type(hsmTemplateName + "{enter}");
  //   cy.get("[data-testid=DeleteIcon]").click();
  //   cy.contains("Confirm").click();
  //   cy.get("div").should("contain", "HSM Template deleted successfully");
  // });
});
