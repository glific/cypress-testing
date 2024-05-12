import { aliasQuery } from '../../../utils/graphql-test-utils';

describe('Chats', () => {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.intercept('POST', Cypress.env('backendUrl'), (req) => {
      aliasQuery(req, 'bspbalance');
    });

    cy.visit('/group/chat');
    cy.wait(1000);
  });

  it('should send the message correctly', () => {
    const messageText = 'Sample Message for testing ' + +new Date();
    let oldCount: number;
    cy.get('[data-testid="messageContainer"]').then((ele) => {
      const getElement = ele.find('[data-testid="message"]');
      oldCount = getElement.length;
    });
    cy.get('[data-testid="editor"]').click({ force: true }).type(messageText);
    cy.get('[data-testid="sendButton"]').click().wait(500);
    // wait for 1 second for the subscription to receieve
    cy.wait(1000);
    // check if the same msg is showing on screen after send
    cy.get('[data-testid="message"]').last().should('contain', messageText);
  });

  it('Send attachment - Image', () => {
    cy.sendImageAttachment();
  });

  it('Send attachment - Audio', () => {
    cy.sendAudioAttachment();
  });

  it('Send attachment - Video', () => {
    cy.sendVideoAttachment();
  });

  it('Send attachment - Document', () => {
    cy.sendDocumentAttachment();
  });

  it('Send attachment - Sticker', () => {
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
    cy.get("div[data-testid='listingContainer'] > ul")
      .find('a')
      .then((chats) => {
        if (chats.length > 10) {
          cy.get("div[data-testid='listingContainer']").scrollTo(0, 500);
          cy.wait(500);
          cy.get('div').contains('Go to top').click({ force: true });
          cy.window().its('scrollY').should('equal', 0);
        }
      });
  });

  it('should load more chats', () => {
    cy.get('body').then((body) => {
      if (body[0].querySelector('[data-testid="clearIcon"]')) {
        cy.get('[data-testid="clearIcon"]').click({ force: true });
      }
    });
    cy.get("div[data-testid='listingContainer'] > ul")
      .find('a')
      .then((chats) => {
        if (chats.length >= 50) {
          cy.get("div[data-testid='listingContainer']").scrollTo('bottom');
          cy.wait(500);
          cy.get('div').contains('Load more chats').click({ force: true });
        }
      });
  });
});
