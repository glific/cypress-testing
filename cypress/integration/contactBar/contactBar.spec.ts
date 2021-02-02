describe("Contact bar", function () {
  const messageText = "Sample Message for testing " + +new Date();
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat");
  });

  // it("should view contact profile", () => {
  //   cy.get(".ContactBar_Configure__3VMnW").click();
  //   // For Simulator this option is disabled
  //   cy.get('[data-testid="beneficiaryName"]').then((body) => {
  //     if (body[0].innerText !== "Simulator") {
  //       cy.contains("View contact profile").click();
  //       cy.get("div").should("contain", "Edit Contact");
  //     }
  //   });
  // });

  it("should add to collection", () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    cy.contains("Add to collection").click();
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
      cy.get(".MuiAutocomplete-popper").click();
    cy.get("[data-testid=ok-button]").click({ force: true });
    cy.contains("Added to 1 collection");
  });

  it("should remove from collection", () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    cy.contains("Add to collection").click();
    cy.wait(500);
    cy.get('[data-testid="deleteIcon"]').last().click();
    cy.get("[data-testid=ok-button]").click({ force: true });
    cy.contains("Removed from 1 collection");
  });

  // it("should block contact", function () {
  //   cy.get(".ContactBar_Configure__3VMnW").click();
  //   // For Simulator this option is disabled
  //   cy.get('[data-testid="beneficiaryName"]').then((body) => {
  //     if (body[0].innerText !== "Simulator") {
  //       cy.contains("Block Contact").click();
  //       cy.get(
  //         ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
  //       ).click();

  //       // undo Block contact after test
  //       cy.get("[data-testid=staffManagementMenu]").click();
  //       cy.contains("Blocked Contacts").click();
  //       cy.get("[data-testid=additionalButton]").first().click();
  //       cy.get(
  //         ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
  //       ).click();
  //     }
  //   });
  // });

  // it("should clear conversations", () => {
  //   cy.get(".ContactBar_Configure__3VMnW").click();
  //   cy.contains("Clear conversation").click();
  //   cy.get(
  //     ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
  //   ).click();
  //   cy.get("div").should("contain", "Conversation cleared for this contact");

  //   // after checking a clear conversation, don't want to lose contact, so send a message.
  //   cy.get(".DraftEditor-editorContainer").click({ force: true });
  //   cy.get(".DraftEditor-editorContainer").type(messageText);
  //   cy.get('[data-testid="sendButton"]').click();
  // });
});
