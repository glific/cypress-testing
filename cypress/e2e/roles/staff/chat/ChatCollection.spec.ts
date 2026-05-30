describe('Role - Staff - ChatCollection', () => {
  beforeEach(function () {
    // login before each test
    cy.appLogin(Cypress.env('staff').phone, Cypress.env('staff').password);
    // addContactToCollection requires a contact chat to be open first
    cy.visit('/chat');
    cy.wait(1000);
    cy.get('[data-testid="searchInput"]').click({ force: true }).wait(500).type('Glific Simulator').wait(1000);
    cy.get("div[data-testid='listingContainer'] > ul").find('a').first().click();
    cy.addContactToCollection();
    cy.visit('/chat/collection');
    cy.wait(500);
  });

  it('should send the message to collection', () => {
    cy.wait(1000);
    cy.get("div[data-testid='chatInfo']").first().click();
    cy.sendTextMessage('collection');
  });

  it('should send the emoji to collection', () => {
    cy.sendEmojiMessage('collection');
  });

  it('should send attachment to collection - Image', () => {
    cy.sendImageAttachment('collection');
  });

  it('should send attachment to collection - Video', () => {
    cy.sendVideoAttachment('collection');
  });

  it('should send attachment to collection - Audio', () => {
    cy.sendAudioAttachment('collection');
  });

  it('should send attachment to collection - Document', () => {
    cy.sendDocumentAttachment('collection');
  });

  it('should send attachment to collection - Sticker', () => {
    cy.sendStickerAttachment('collection');
  });

  it('should jump to latest', () => {
    cy.jumpToLatest();
  });
});
