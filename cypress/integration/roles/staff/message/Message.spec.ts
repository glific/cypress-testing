// replacing tags with labels

// describe("Role - Staff - Message", () => {
//   beforeEach(function () {
//     // login before each
//     cy.appLogin(Cypress.env("staff").phone, Cypress.env("staff").password);
//     cy.visit("/chat");
//     cy.wait(500);
//   });

//   it("should tag a message", () => {
//     cy.get('[data-testid="messageOptions"]').last().click();
//     cy.contains("Assign tag").click();
//     cy.get('[title="Open"]').click().wait(500);
//     cy.get(".MuiAutocomplete-popper").first().click();
//     cy.get('[title="Close"]').click();
//     cy.get('[data-testid="ok-button"]').click().wait(500);
//     cy.contains("Tags added successfully");
//   });

//   it("should remove tag from a message", () => {
//     cy.get('[data-testid="tags"]')
//       .last()
//       .find('[data-testid="deleteIcon"]')
//       .click()
//       .wait(500);
//     cy.contains("Tag deleted successfully");
//   });
// });
