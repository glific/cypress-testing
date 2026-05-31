describe('Role - Staff - ChatCollection', () => {
  beforeEach(function () {
    cy.env(['staff']).then(({ staff }) => {
      cy.appLogin(staff.phone, staff.password);
    });
    cy.addContactToCollection();
    cy.visit('/chat/collection');
  });

  it('should send the message to collection', () => {
    cy.sendTextMessage('collection');
  });
});
