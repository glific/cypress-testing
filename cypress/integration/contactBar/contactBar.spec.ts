describe("Contact bar", function () {
  const messageText = "Sample Message for testing " + +new Date();
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat");
  });

  it("should view contact profile", () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    // For Simulator this option is disabled
    cy.get('[data-testid="beneficiaryName"]').then((body) => {
      if (body[0].innerText !== "Simulator") {
        cy.contains("View contact profile").click();
        cy.get("div").should("contain", "Edit Contact");
      }
    });
  });



  // Need to fix this test case

  // it("should block contact", function () {
  //   cy.get(".ContactBar_Configure__3VMnW").click();
  //   // For Simulator this option is disabled
  //   cy.get('[data-testid="beneficiaryName"]').then((body) => {
  //     if (body[0].innerText !== "Simulator") {
  //       cy.contains("Block Contact").click();
  //       cy.get(
  //         ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label",
  //         { timeout: 10000 }
  //       ).click();

  //       // undo Block contact after test
  //       cy.get("[data-testid=staffManagementMenu]").wait(5000).click();
  //       cy.contains("Blocked Contacts").click();
  //       cy.get("[data-testid=additionalButton]").first().click();
  //       cy.get(
  //         ".MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(1) > .MuiButton-label"
  //       ).click();
  //     }
  //   });
  // });


  

  it("should start a flow", () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    // only if 'start a flow' btn is enabled
    if (cy.get('[data-testid="flowButton"]')) {
      cy.get('[data-testid="flowButton"]').click({ force: true });
      cy.get('[data-testid="dropdown"]').click();
      cy.get('.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul').last().then((list) => {
        if (list.length > 0) {
          cy.get('.MuiMenu-list > .MuiButtonBase-root:nth-child(1)').click();
          cy.get("[data-testid=ok-button]").click({ force: true });
          cy.wait(500);
          cy.get('[data-testid="app"]').find('div').should('contain', "Flow started successfully");
        }
      })
    }
  });

  // first we need to start our simulator and then we can have these tests
  it("should add to collection", () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    if (cy.get('[data-testid="collectionButton"]')) {
      cy.get('[data-testid="collectionButton"]').click({ force: true });
      cy.get('[data-testid="autocomplete-element"]')
        .click()
        .type("Restricted Group");
      cy.get(".MuiAutocomplete-popper").click();
      cy.get("[data-testid=ok-button]").click({ force: true });
      cy.wait(500);
      cy.get('[data-testid="app"]').find('div').should('contain', "Added to 1 collection");
    }
  });

  it("should remove from collection", () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    if (cy.get('[data-testid="collectionButton"]')) {
      cy.get('[data-testid="collectionButton"]').click({ force: true });
      cy.get('[data-testid="deleteIcon"]').first().click({ force: true });
      cy.get("[data-testid=ok-button]").click({ force: true });
      cy.wait(500);
      cy.get('[data-testid="app"]').find('div').should('contain', "Removed from 1 collection");
    }
  });

  it("should clear conversations", () => {
    cy.get('[data-testid="dropdownIcon"]').click();
    cy.contains("Clear conversation").click();
    cy.get('[data-testid="ok-button"]').click();
    cy.get('[data-testid="app"]').find('div').should("contain", "Conversation cleared for this contact");
    // after checking a clear conversation, don't want to lose contact, so send a message.
    cy.get(".DraftEditor-editorContainer").click({ force: true });
    cy.get(".DraftEditor-editorContainer").type(messageText);
    cy.get('[data-testid="sendButton"]').click();
  });
});
