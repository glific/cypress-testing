describe("Contact bar", function () {
  const messageText = "Sample Message for testing " + +new Date();
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat");
  });

  it("should view contact profile", () => {
    cy.get(".ContactBar_Configure__3VMnW").click();
    cy.contains("View contact profile").click();
    cy.get("div").should("contain", "Edit Contact");
  });

  it("should add to group", () => {
    cy.get(".ContactBar_Configure__3VMnW").click();
    cy.contains("Add to group").click();
    cy.get('[data-testid="autocomplete-element"]')
      .first()
      .click()
      .type("Restricted Group");
    cy.contains("Restricted Group").click();
    cy.get("[data-testid=ok-button]").click({ force: true });
    cy.get("[data-testid=crossIcon]").click();

    // undo added contact in the group after test
    cy.wait(1000);
    cy.get(".ContactBar_Configure__3VMnW > svg").click();
    cy.contains("Add to group").click();
    cy.wait(500);
    cy.get("[data-testid=AutocompleteInput] > .MuiInputBase-root").click();
    cy.get(
      ".MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiButtonBase-root:nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root"
    ).click();
    cy.get(
      ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
    ).click({ force: true });
  });

  it("should block contact", function () {
    cy.get(".ContactBar_Configure__3VMnW").click();
    cy.contains("Block Contact").click();
    cy.get(
      ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
    ).click();

    // undo Block contact after test
    cy.get(
      "div > span > .MuiButtonBase-root > .MuiIconButton-label > .SideDrawer_StaffIcon__1dO98"
    ).click();
    cy.contains("Blocked Contacts").click();
    cy.get("[data-testid=additionalButton]").first().click();
    cy.get(
      ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
    ).click();
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
