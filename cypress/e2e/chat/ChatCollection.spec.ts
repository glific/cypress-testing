describe('ChatCollection', () => {
  before(function () {
    cy.login();
    cy.addContactToCollection();
  });

  beforeEach(function () {
    cy.login();
    cy.visit('/chat/collection');
    cy.contains('a[data-testid="list"] [data-testid="name"]', 'Default Group').click({
      force: true,
    });
  });

  it('should send the message to collection', () => {
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
