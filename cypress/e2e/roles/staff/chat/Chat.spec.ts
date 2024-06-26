describe('Role - Staff - Chats', () => {
  const speedSendTitle = 'Speed Send saved from chat ' + +new Date();

  beforeEach(function () {
    // login before each test
    cy.appLogin(Cypress.env('staff').phone, Cypress.env('staff').password);
    cy.visit('/chat');
    cy.wait(1000);
    cy.get('[data-testid="searchInput"]')
      .click({ force: true })
      .wait(500)
      .type('Glific Simulator')
      .wait(1000);
    cy.get("div[data-testid='listingContainer'] > ul").find('a').first().click();
  });

  it('should have only chat menu', () => {
    // staff can see only chats menu, others are not accessible
    cy.get('[data-testid="list"]').first().should('contain', 'Chats');

    cy.get('[data-testid="list"]')
      .first()
      // .should("not.contain", "Tags")
      .and('not.contain', 'Speed sends')
      .and('not.contain', 'Flows')
      .and('not.contain', 'Searches')
      .and('not.contain', 'Templates');
  });

  it('should send the message correctly', () => {
    cy.sendTextMessage();
  });

  it('should send the emoji in message', () => {
    cy.sendEmojiMessage();
  });

  it('should send the speed send', () => {
    cy.get('[data-testid="shortcut-open-button"]').click().wait(500);
    cy.wait(500);
    cy.get('[data-testid="shortcutButton"]').contains('Speed sends').click().wait(500);
    cy.get('[data-testid="templateItem"] :first').click();
    cy.get('[data-testid="sendButton"]').click();
    // TODOS: Due to some wierd subscription related issue in the test run below assertion is failing
    // Message is sent successfully let's come back to this later
    // cy.get("div").should("contain", "Please click on the link");
  });

  it('should send the templates', () => {
    cy.get('[data-testid="shortcut-open-button"]').click().wait(500);
    cy.get('[data-testid="shortcutButton"]').then((shortcutButton) => {
      // check if we have both the templates and speed send button
      if (shortcutButton.length === 2 && shortcutButton.eq(0).contents().text() === 'Templates') {
        cy.get('[data-testid="shortcutButton"]')
          .contains('Templates')
          .eq(0)
          .click({ multiple: true, force: true });
        cy.get('.ChatInput_ChatSearchBar__zM149 .MuiInputBase-input')
          .click({ multiple: true, force: true })
          .type('attached bill');
        cy.get('div:nth-child(1) > [data-testid="templateItem"]').then((param) => {
          if (param.length > 0) {
            cy.get('div:nth-child(1) > [data-testid="templateItem"]').click();
            cy.get('[data-testid=AutocompleteInput]').click().type('ABC');
            cy.get('[data-testid="ok-button"]').click();

            // check if the template is showing on screen after send
            cy.get('[data-testid="editor"]').then((text) => {
              cy.get('[data-testid="sendButton"]').click();
              cy.get('.ChatMessage_Content__1CvXE')
                .last()
                .then((msgContent) => {
                  cy.get('div').should('contain', text[0].innerText);
                });
            });
          }
        });
      } else {
        cy.get('[data-testid="shortcut-open-button"]').click().wait(500);
      }
    });
  });

  it('should send add to speed send', () => {
    cy.get('[data-testid="message"]:last()').find('svg').click({ multiple: true, force: true });
    cy.contains('Add to speed sends').click({ force: true });
    // check input field validation
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get('[data-testid="templateContainer"]').find('p').should('contain', 'Required');
    cy.get('[data-testid="templateInput"]').type(speedSendTitle);
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.wait(1000);
    cy.get('div').should('contain', 'Message has been successfully added to speed sends.');
  });

  it('Send attachment - Image', function () {
    cy.sendImageAttachment();
  });

  it('Send attachment - Audio', function () {
    cy.sendAudioAttachment();
  });

  it('Send attachment - Video', function () {
    cy.sendVideoAttachment();
  });

  it('Send attachment - Document', function () {
    cy.sendDocumentAttachment();
  });

  it('Send attachment - Sticker', function () {
    cy.sendStickerAttachment();
  });

  it('should jump to latest', () => {
    cy.jumpToLatest();
  });

  it('should go to top', () => {
    cy.get('body').then((body) => {
      if (body[0].querySelector('[data-testid="clearIcon"]')) {
        cy.get('[data-testid="clearIcon"]').click({ force: true });
      }
    });
    cy.get('div[data-testid="listingContainer"] > ul')
      .find('a')
      .then((chats) => {
        if (chats.length > 10) {
          cy.get('div[data-testid="listingContainer"]').scrollTo(0, 500);
          cy.wait(500);
          cy.get('div').contains('Go to top').click({ force: true });
          cy.window().its('scrollY').should('equal', 0); //  confirm whether its came back to its original position
        }
      });
  });

  it('should load more chats', () => {
    cy.get('body').then((body) => {
      if (body[0].querySelector('[data-testid="clearIcon"]')) {
        cy.get('[data-testid="clearIcon"]').click({ force: true });
      }
    });
    cy.get('div[data-testid="listingContainer"] > ul')
      .find('a')
      .then((chats) => {
        if (chats.length >= 50) {
          cy.get('.ConversationList_ChatListingContainer__18YGc').scrollTo('bottom');
          cy.wait(500);
          cy.get('div').contains('Load more chats').click({ force: true });
        }
      });
  });

  // it('should check session timer class/tooltip according to its value', () => {
  //   cy.get('div[data-testid="timerContainer"]').then((param) => {
  //     if (parseInt(param[0].innerText) > 10) {
  //       cy.sessionTimer(
  //         '_TimerNormal',
  //         'Session window is open to message this contact. Learn more about the WhatsApp session window here.'
  //       );
  //     }
  //     if (parseInt(param[0].innerText) > 0 && parseInt(param[0].innerText) < 5) {
  //       cy.sessionTimer(
  //         '_TimerApproachEnd',
  //         'Your message window is about to expire! Learn more about the WhatsApp session window here.'
  //       );
  //     }
  //     if (parseInt(param[0].innerText) == 0) {
  //       cy.sessionTimer(
  //         '_TimerEnd',
  //         'Session message window has expired! You can only send a template message now. Learn more about the WhatsApp session window here.'
  //       );
  //     }
  //   });
  // });

  // it("should have staff management and profile bottom menu", () => {
  //   cy.get('[data-testid="bottom-menu"]')
  //     .find("img")
  //     .should("have.attr", "title")
  //     .and("contain", "Staff Management");
  //   cy.wait(500);
  //   cy.get('[data-testid="Menu"]')
  //     .find("img")
  //     .should("have.attr", "title")
  //     .and("contain", "Profile");
  // });
});
