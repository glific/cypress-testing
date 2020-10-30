describe("Contact bar", function () {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat");
  });

  it("should view contact profile", () => {
    cy.get('.ContactBar_Configure__3VMnW').click();
    cy.contains('View contact profile').click();
    cy.get("div").should("contain", "Contact Profile");
  });

  // it("should add to group", () => {
  //   cy.get(".ContactBar_Configure__3VMnW").click();
  //   cy.contains("Add to group").click();
  //   cy.get(
  //     ".MuiFormControl-root > .MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #mui-46063"
  //   ).click();
  //   cy.get(
  //     "body > .MuiAutocomplete-popper > .MuiPaper-root > #mui-46063-popup > #mui-46063-option-0"
  //   ).click();
  //   cy.get(
  //     "body > .MuiDialog-root > .MuiDialog-container > .MuiPaper-root > #alert-dialog-title"
  //   ).click();
  //   cy.get(
  //     ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
  //   ).click();
  //   cy.get(
  //     ".MuiContainer-root > .MuiSnackbar-root > .MuiPaper-root > .MuiAlert-action > svg"
  //   ).click();
  //   cy.get("div").should("contain", "Added to group succesfully");
  // });

  it("should clear conversations", () => {
    cy.get('.ContactBar_Configure__3VMnW').click();
    cy.contains('Clear conversation').click();
    cy.get(
      ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
    ).click();
    cy.get("div").should("contain", "Conversation cleared for this contact");
  });
});
