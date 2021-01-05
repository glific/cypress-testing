describe("Contact bar", function () {
  const messageText = "Sample Message for testing " + +new Date();
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat");
  });

  it("should view contact profile", () => {
    cy.get(".ContactBar_Configure__3VMnW").click();
    // For Simulator this option is disabled
    if (!cy.get('[data-testid="beneficiaryName"]').contains("Simulator")) {
      cy.contains("View contact profile").click();
      cy.get("div").should("contain", "Edit Contact");
    }
  });

  it("should add to group", () => {
    cy.get(".ContactBar_Configure__3VMnW").click();
    cy.contains("Add to group").click();
    if (
      cy.get(
        ".MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiButtonBase-root:nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root"
      )
    ) {
      cy.get(
        ".MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiButtonBase-root:nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root"
      ).click({ force: true });
    }
    cy.get('[data-testid="autocomplete-element"]')
      .click()
      .type("Restricted Group");
    cy.get(
      ".MuiDialog-root > .MuiDialog-container > .MuiPaper-root > #alert-dialog-title > .MuiTypography-root"
    ).click();
    cy.get("[data-testid=ok-button]").click({ force: true });
  });

  it("should remove from group", () => {
    cy.get(".ContactBar_Configure__3VMnW > svg").click();
    cy.contains("Add to group").click();
    cy.wait(500);
    cy.get("[data-testid=AutocompleteInput] > .MuiInputBase-root").click();
    cy.get(
      ".MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiButtonBase-root:nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root"
    ).click({ force: true });
    cy.get(
      ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
    ).click({ force: true });
  });

  it("should block contact", function () {
    cy.get(".ContactBar_Configure__3VMnW").click();
    // For Simulator this option is disabled
    if (!cy.get('[data-testid="beneficiaryName"]').contains("Simulator")) {
      cy.contains("Block Contact").click();
      cy.get(
        ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
      ).click();

      // undo Block contact after test
      cy.get("[data-testid=staffManagementMenu]").click();
      cy.contains("Blocked Contacts").click();
      cy.get("[data-testid=additionalButton]").first().click();
      cy.get(
        ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
      ).click();
    }
  });

  it("should clear conversations", () => {
    cy.get(".ContactBar_Configure__3VMnW").click();
    cy.contains("Clear conversation").click();
    cy.get(
      ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
    ).click();
    cy.get("div").should("contain", "Conversation cleared for this contact");

    // after checking a clear conversation, don't want to lose contact, so send a message.
    cy.get(".DraftEditor-editorContainer").click({ force: true });
    cy.get(".DraftEditor-editorContainer").type(messageText);
    cy.get('[data-testid="sendButton"]').click();
  });
});
