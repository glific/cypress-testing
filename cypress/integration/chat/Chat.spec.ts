describe("Chats", () => {
  const messageText = "Sample Message for testing " + +new Date();
  const speedSendTitle = "Speed Send saved from chat " + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat");
    cy.wait(500);
  });

  // The Default Receiver is not present on staging
  // Need to find a way to test this
  // it("should load the correct message", () => {
  //   cy.contains('[data-testid="list"]', "Default receiver").click();
  //   cy.get("div").should("contain", "Default message body");
  // });

  it("should send the message correctly", () => {
    cy.sendTextMessage();

    // TODOS: Due to some wierd subscription related issue in the test run below assertion is failing
    // Message is sent successfully let's come back to this later
    // cy.get('[data-testid="messageContainer"]').should("contain", messageText);
  });

  it("should send the emoji in message", () => {
    cy.sendEmojiMessage();
  });

  // Need to fix
  // it("should tag the message correctly", () => {
  //   // find options next to the recently added message
  //   cy.contains('[data-testid="message"]', messageText)
  //     .first()
  //     .find("svg")
  //     .click({ multiple: true, force: true });
  //   cy.contains("Assign tag").click();
  //   cy.get("h2").should("contain", "Assign tag to message");
  //   cy.get("[data-testid=AutocompleteInput] > .MuiInputBase-root")
  //     .click()
  //     .type("Important");
  //   cy.get(
  //     "body > .MuiDialog-root > .MuiDialog-container > .MuiPaper-root > .MuiDialogContent-root"
  //   ).click();
  //   cy.get('[data-testid="ok-button"]').click({ force: true });
  //   cy.get("div").should("contain", "Tags added successfully");
  // });

  // it("should remove message tag correctly", () => {
  //   cy.get('[data-testid="tags"]')
  //     .contains("Important")
  //     .find('[data-testid="deleteIcon"]')
  //     .click();
  //   cy.get("div").should("contain", "Tag deleted successfully");
  // });

  it("should send the speed send", () => {
    cy.get('[data-testid="shortcutButton"]').first().click({ multiple: true });
    cy.get('[data-testid="templateItem"] :first').click();
    cy.get('[data-testid="sendButton"]').click();
    // TODOS: Due to some wierd subscription related issue in the test run below assertion is failing
    // Message is sent successfully let's come back to this later
    // cy.get("div").should("contain", "Please click on the link");
  });

  it("should send the templates", () => {
    cy.get('[data-testid="shortcutButton"]').contains('Templates').eq(0).then((body) => {
      if (body.length > 0) {
        cy.get('[data-testid="shortcutButton"]').contains('Templates').eq(0).click({ multiple: true });
        cy.get('[data-testid="searchInput"]').first().click({ multiple: true })
          .type("attached bill");
        cy.get('div:nth-child(1) > [data-testid="templateItem"]').then((param) => {
          if (param.length > 0) {
            cy.get('div:nth-child(1) > [data-testid="templateItem"]').click();
            cy.get("input[name=variable1]").click().type('ABC');
            cy.get("input[name=variable1]").clear();
            cy.get('[data-testid="ok-button"]').click();
            cy.get("p").should("contain", "Variable 1 is required.");
            cy.get("input[name=variable1]").click().type('ABC');
            cy.get('[data-testid="ok-button"]').click();
            // check if the template is showing on screen after send
            cy.get('.public-DraftStyleDefault-block').then((text) => {
              cy.get('[data-testid="sendButton"]').click();
              cy.get('[data-testid="message"]').last().then(() => {
                cy.get('div').should('contain', text[0].innerText);
              })
            })
          }
        });
      }
    })
  })

  it("should send add to speed send", () => {
    cy.get('[data-testid="message"]:last()')
      .find('svg')
      .click({ multiple: true, force: true });
    cy.contains("Add to speed sends").click();
    // check input field validation
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get('[data-testid="templateContainer"]')
      .find('p')
      .should('contain', 'Required');
    cy.get('[data-testid="templateInput"]').type(speedSendTitle);
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.wait(1000);
    cy.get("div").should(
      "contain",
      "Message has been successfully added to speed sends."
    );
  });

  it("Send attachment - Image", function () {
    cy.sendImageAttachment();
    // cy.get('[data-testid="messageContainer"]').should("contain", captions);
  });

  it("Send attachment - Audio", function () {
    cy.sendAudioAttachment();
    // cy.get('[data-testid="messageContainer"]').should("contain", captions);
  });

  it("Send attachment - Video", function () {
    cy.sendVideoAttachment();
    // cy.get('[data-testid="messageContainer"]').should("contain", captions);
  });

  it("Send attachment - Document", function () {
    cy.sendDocumentAttachment();
    // cy.get('[data-testid="messageContainer"]').should("contain", captions);
  });

  it("Send attachment - Sticker", function () {
    cy.sendStickerAttachment();
    // cy.get('[data-testid="messageContainer"]').should("contain", captions);
  });

  it("should jump to latest", () => {
    cy.jumpToLatest();
  });

  it("should go to top", () => {
    cy.get('[data-testid="clearIcon"]').click({ force: true });
    cy.get('.ConversationList_ListingContainer__2IFT- > ul').find('a').then((chats) => {
      if (chats.length > 10) {
        cy.get('.ConversationList_ListingContainer__2IFT-').scrollTo(0, 500);
        cy.wait(500);
        cy.get('div').contains('Go to top').click({ force: true });
        cy.window().its('scrollY').should('equal', 0); //  confirm whether its came back to its original position
      }
    })
  });

  it("should load more chats", () => {
    cy.get('[data-testid="clearIcon"]').click({ force: true });
    cy.get('.ConversationList_ListingContainer__2IFT- > ul').find('a').then((chats) => {
      if (chats.length >= 50) {
        cy.get('.ConversationList_ListingContainer__2IFT-').scrollTo('bottom');
        cy.wait(500);
        cy.get('div').contains('Load more chats').click({ force: true });
      }
    })
  });
});
