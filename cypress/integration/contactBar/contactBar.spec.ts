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
    cy.get("div").should("contain", "Contact Profile");
  });

  it("should add to group", () => {
    cy.get(".ContactBar_Configure__3VMnW").click();
    cy.contains("Add to group").click();
    cy.get('[data-testid="autocomplete-element"]').first().type("Default");
    cy.contains("Default Group").click();
    cy.get("[data-testid=ok-button]").click({ force: true });

    // undo added contact in the group after test
    cy.visit("/group/1/contacts");
    cy.get("[data-testid=DeleteIcon]").first().click();
    cy.get(
      ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
    ).click();
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
