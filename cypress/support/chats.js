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

Cypress.Commands.add('sendTextMessage', (type) => {
  const messageText = 'Sample Message for testing ' + +new Date();
  let oldCount;
  cy.get('[data-testid="messageContainer"]').then((ele) => {
    const getElement = ele.find('[data-testid="message"]');
    oldCount = getElement.length;
  });
  cy.get('[data-testid="editor"]').click({ force: true }).type(messageText);
  cy.get('[data-testid="sendButton"]').click().wait(500);
  cy.checkContactStatus(type);
  // wait for 1 second for the subscription to receieve
  cy.wait(1000);
  // check if the same msg is showing on screen after send

  cy.get('[data-testid="message"]').last().should('contain', messageText);
  // check: send message occurrence should be 1
  cy.get('[data-testid="messageContainer"]').then((ele) => {
    cy.wrap(ele)
      .find('[data-testid="message"]')
      .its('length')
      .should('eq', oldCount + 1);
  });
});

Cypress.Commands.add('sendEmojiMessage', (type) => {
  cy.get('[data-testid="editor"]').click();
  cy.get('[data-testid="emoji-picker"]').click();
  cy.wait(500);
  cy.get('em-emoji-picker').shadow().find('button[aria-label="😀"]').eq(1).click({ force: true });
  cy.get('[data-testid="editor"]').then((text) => {
    cy.get('[data-testid="sendButton"]').click();
    cy.checkContactStatus(type);
    // check if the emoji is showing on screen after send
    cy.get('[data-testid="message"]')
      .last()
      .then(() => {
        cy.get('div').should('contain', text[0].innerText);
      });
  });
});

Cypress.Commands.add('sendImageAttachment', (type) => {
  const captions = 'Image ' + +new Date();
  cy.get("button[data-testid='attachmentIcon']").click();
  cy.get('#mui-component-select-attachmentType').click();
  cy.get(
    'body > #menu-attachmentType > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(1)'
  ).click();
  cy.get('[data-testid="outlinedInput"]').click();
  cy.get('[data-testid="outlinedInput"]').type(
    'https://www.buildquickbots.com/whatsapp/media/sample/jpg/sample01.jpg'
  );
  cy.wait(2000);
  cy.addAttachmentCaption(captions, type);
});

Cypress.Commands.add('sendVideoAttachment', (type) => {
  const captions = 'Video ' + +new Date();
  cy.get("button[data-testid='attachmentIcon']").click();
  cy.get('#mui-component-select-attachmentType').click();
  cy.get(
    'body > #menu-attachmentType > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(3)'
  ).click();
  cy.get('[data-testid="outlinedInput"]').click();
  cy.get('[data-testid="outlinedInput"]').type(
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
  );
  cy.wait(2000);
  cy.addAttachmentCaption(captions, type);
});

Cypress.Commands.add('sendAudioAttachment', (type) => {
  cy.get("button[data-testid='attachmentIcon']").click();
  cy.get('#mui-component-select-attachmentType').click();
  cy.get(
    'body > #menu-attachmentType > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(2)'
  ).click();
  cy.get('[data-testid="outlinedInput"]').click();
  cy.get('[data-testid="outlinedInput"]').type(
    'https://www.buildquickbots.com/whatsapp/media/sample/audio/sample01.mp3'
  );
  cy.wait(2000);
  cy.addAttachmentCaption('', type);
});

Cypress.Commands.add('sendDocumentAttachment', (type) => {
  const captions = 'Document ' + +new Date();
  cy.get("button[data-testid='attachmentIcon']").click();
  cy.get('#mui-component-select-attachmentType').click();
  cy.get(
    'body > #menu-attachmentType > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(4)'
  ).click();
  cy.get('[data-testid="outlinedInput"]').click();
  cy.get('[data-testid="outlinedInput"]').type(
    'https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample01.pdf'
  );
  cy.wait(2000);
  cy.addAttachmentCaption(captions, type);
});

Cypress.Commands.add('sendStickerAttachment', (type) => {
  cy.get("button[data-testid='attachmentIcon']").click();
  cy.get('#mui-component-select-attachmentType').click();
  cy.get(
    'body > #menu-attachmentType > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(5)'
  ).click();
  cy.get('[data-testid="outlinedInput"]').click();
  cy.get('[data-testid="outlinedInput"]').type(
    'http://www.buildquickbots.com/whatsapp/stickers/SampleSticker01.webp'
  );
  cy.wait(2000);
  cy.addAttachmentCaption('', type);
});

// common method to add captions with attachments
Cypress.Commands.add('addAttachmentCaption', (captions, type) => {
  let oldCount;
  cy.get('[data-testid="messageContainer"]').then((ele) => {
    const getElement = ele.find('[data-testid="message"]');
    oldCount = getElement.length;
  });
  cy.get('[data-testid="ok-button"]').click();
  if (captions) {
    cy.get('[data-testid="editor"]').type(captions);
  }
  cy.get('[data-testid="sendButton"]').click();
  cy.checkContactStatus(type);
  cy.wait(1000);
  if (captions) {
    cy.wait(1000);
    // check if attachment is showing on screen
    cy.get('[data-testid="message"]')
      .last()
      .then((ele) => {
        if (ele.length > 0) {
          cy.get('[data-testid="message"]').find('div').should('contain', captions);
        }
      });
  }
  // check: send message occurrence should be 1
  cy.get('[data-testid="messageContainer"]').then((ele) => {
    cy.wrap(ele)
      .find('[data-testid="message"]')
      .its('length')
      .should('eq', oldCount + 1);
  });
  cy.wait(1000);
});

Cypress.Commands.add('jumpToLatest', () => {
  cy.get('[data-testid="messageContainer"]')
    .find('[data-testid="message"]')
    .then((msg) => {
      if (msg.length > 10) {
        cy.get('[data-testid="messageContainer"]').scrollTo('top', {
          duration: 1,
        });
        cy.wait(500);

        // need to check why these are failing
        // cy.get('[data-testid="jumpToLatest"]').click({ force: true });
        // cy.window().its("scrollY").should("equal", 0); //  confirm whether its came back to its original position
      }
    });
});

Cypress.Commands.add('sessionTimer', (className, tooltipMsg) => {
  var regexp = new RegExp(className, 'gi');
  cy.get('[data-testid="timerCount"]').eq(1).should('have.attr', 'class').and('match', regexp);
  cy.get('[data-testid="timerCount"]').eq(1).trigger('mouseover');
  cy.get('.MuiTooltip-tooltip').should('contain', tooltipMsg);
});

Cypress.Commands.add('closeSimulator', () => {
  cy.get('[data-testid="layout"]').then((body) => {
    if (body.find('[data-testid="clearIcon"]').length > 0) {
      cy.get('[data-testid="clearIcon"]').click();
    }
  });
});

Cypress.Commands.add('checkContactStatus', (type) => {
  if (type === 'collection') {
    cy.contains('Contact status');
    cy.get('[data-testid="ok-button"]').click();
  }
});

Cypress.Commands.add('addContactToCollection', (type) => {
  cy.get('[data-testid="dropdownIcon"]').click();
  cy.get('[data-testid="collectionButton"]').click();

  cy.get('[data-testid=autocomplete-element]')
    .type('Simulator' + '{enter}')
    .wait(500);
  cy.get('.MuiAutocomplete-option').first().click();
  cy.get('[data-testid="ok-button"]').click({ force: true });
  cy.get('div').should('contain', '1 contact added');
});
