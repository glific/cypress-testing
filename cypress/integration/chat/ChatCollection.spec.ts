describe("ChatCollection", () => {

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat/collection");
    cy.wait(500);
  });

  it("should send the message to collection", () => {
    cy.get('[data-testid="list"]:nth-child(1) > .ChatConversation_ChatInfo__2Egje').click();
    cy.sendTextMessage();
  });

  it("should send the emoji to collection", () => {
   cy.sendEmojiMessage();
  });

  it("should send attachment to collection - Image", () => {
   cy.sendImageAttachment();
  });

  it("should send attachment to collection - Video", () => {
   cy.sendVideoAttachment();
  });

  it("should send attachment to collection - Audio", () => {
   cy.sendAudioAttachment();
  });

  it("should send attachment to collection - Document", () => {
   cy.sendDocumentAttachment();
  });

  it("should send attachment to collection - Sticker", () => {
   cy.sendStickerAttachment();
  });

  it("should jump to latest", () => {
   cy.jumpToLatest();
  });
});