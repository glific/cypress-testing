// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

Cypress.Commands.add("sendTextMessage", () => {
  const messageText = "Sample Message for testing " + +new Date();
  cy.get(".public-DraftStyleDefault-block")
    .click({ force: true })
    .type(messageText);
  cy.get('[data-testid="sendButton"]').click().wait(500);
  // check if the same msg is showing on screen after send
  cy.get('[data-testid="message"]').last().should("contain", messageText);
});

Cypress.Commands.add("sendEmojiMessage", () => {
  cy.get('[data-testid="emoji-picker"]').click();
  cy.wait(500);
  cy.get(
    '[aria-label="Smileys & People"] > .emoji-mart-category-list > :nth-child(1) > .emoji-mart-emoji > span'
  ).click({ force: true });
  cy.get(".public-DraftStyleDefault-block").then((text) => {
    cy.get('[data-testid="sendButton"]').click();
    // check if the emoji is showing on screen after send
    cy.get('[data-testid="message"]')
      .last()
      .then(() => {
        cy.get("div").should("contain", text[0].innerText);
      });
  });
});

Cypress.Commands.add("sendImageAttachment", () => {
  const captions = "Image " + +new Date();
  cy.get(".ChatInput_AttachmentIcon__3xTp_").click();
  cy.get("#mui-component-select-attachmentType").click();
  cy.get(
    "body > #menu-attachmentType > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(1)"
  ).click();
  cy.get('[data-testid="outlinedInput"]').click();
  cy.get('[data-testid="outlinedInput"]').type(
    "https://www.buildquickbots.com/whatsapp/media/sample/jpg/sample01.jpg"
  );
  cy.wait(500);
  cy.addAttachmentCaption(captions);
});

Cypress.Commands.add("sendVideoAttachment", () => {
  const captions = "Video " + +new Date();
  cy.get(".ChatInput_AttachmentIcon__3xTp_").click();
  cy.get("#mui-component-select-attachmentType").click();
  cy.get(
    "body > #menu-attachmentType > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(3)"
  ).click();
  cy.get('[data-testid="outlinedInput"]').click();
  cy.get('[data-testid="outlinedInput"]').type(
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mov-file.mov"
  );
  cy.wait(500);
  cy.addAttachmentCaption(captions);
});

Cypress.Commands.add("sendAudioAttachment", () => {
  cy.get(".ChatInput_AttachmentIcon__3xTp_").click();
  cy.get("#mui-component-select-attachmentType").click();
  cy.get(
    "body > #menu-attachmentType > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(2)"
  ).click();
  cy.get('[data-testid="outlinedInput"]').click();
  cy.get('[data-testid="outlinedInput"]').type(
    "https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg"
  );
  cy.wait(500);
  cy.addAttachmentCaption();
});

Cypress.Commands.add("sendDocumentAttachment", () => {
  const captions = "Document " + +new Date();
  cy.get(".ChatInput_AttachmentIcon__3xTp_").click();
  cy.get("#mui-component-select-attachmentType").click();
  cy.get(
    "body > #menu-attachmentType > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(4)"
  ).click();
  cy.get('[data-testid="outlinedInput"]').click();
  cy.get('[data-testid="outlinedInput"]').type(
    "https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample01.pdf"
  );
  cy.wait(500);
  cy.addAttachmentCaption(captions);
});

Cypress.Commands.add("sendStickerAttachment", () => {
  cy.get(".ChatInput_AttachmentIcon__3xTp_").click();
  cy.get("#mui-component-select-attachmentType").click();
  cy.get(
    "body > #menu-attachmentType > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(5)"
  ).click();
  cy.get('[data-testid="outlinedInput"]').click();
  cy.get('[data-testid="outlinedInput"]').type(
    "https://www.buildquickbots.com/whatsapp/media/sample/jpg/sample01.jpg"
  );
  cy.wait(500);
  cy.addAttachmentCaption();
});

// common method to add captions with attachments
Cypress.Commands.add("addAttachmentCaption", (captions) => {
  cy.get('[data-testid="ok-button"]').click();
  if (captions) {
    cy.get(".DraftEditor-editorContainer").type(captions);
  }
  cy.get('[data-testid="sendButton"]').click({ force: true });
  if (captions) {
    cy.wait(1000);
    // check if attachment is showing on screen
    cy.get('[data-testid="message"]')
      .last()
      .then((ele) => {
        if (ele.length > 0) {
          cy.get('[data-testid="message"]')
            .find("div")
            .should("contain", captions);
        }
      });
  }
});

Cypress.Commands.add("jumpToLatest", () => {
  cy.get('[data-testid="messageContainer"]')
    .find('[data-testid="message"]')
    .then((msg) => {
      if (msg.length > 10) {
        cy.get('[data-testid="messageContainer"]').scrollTo("top");
        cy.wait(500);
        cy.get('[data-testid="jumpToLatest"]').click({ force: true });
        cy.window().its("scrollY").should("equal", 0); //  confirm whether its came back to its original position
      }
    });
});

Cypress.Commands.add("sessionTimer", (className, tooltipMsg) => {
  cy.get('[data-testid="timerCount"]').eq(1).should("have.class", className);
  cy.get('[data-testid="timerCount"]').eq(1).trigger("mouseover");
  cy.get(".MuiTooltip-tooltip").should("contain", tooltipMsg);
});
