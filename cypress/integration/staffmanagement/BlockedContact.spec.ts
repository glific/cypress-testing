describe("Blocked Contact", () => {
  beforeEach(function () {
    // login before each test
    cy.login();
  });

  it("should load blocked contacts list", () => {
  cy.visit("/blocked-contacts");
    cy.get("h5").should("contain", "Blocked contacts");
  });

  // need to check on this
  // sometimes it takes contact name undefined and sometimes it a phone no
  // we are not allowing to search by phone no in blocked contact window

  // it("should block a contact", () => {
  //   cy.visit("/chat");
  //   cy.get('*[class^="ContactBar_ContactInfoContainer"]').find('[data-testid="beneficiaryName"]').then((body) => {
  //     let contact_name;
  //     if (body[0].innerText !== "Simulator") {
  //       contact_name = body[0].innerText
  //       cy.get('[data-testid="dropdownIcon"').click();
  //     } else {
  //       cy.get("#simulator").get('[data-testid="clearIcon"').click();
  //       cy.get('[data-testid="name"]').eq(1).click({force: true});
  //       cy.get('[data-testid="beneficiaryName"]').then((name) => {
  //         contact_name = name[0].innerText
  //       });
  //       cy.get('[data-testid="dropdownIcon"').click();
  //     }
  //     cy.get('[data-testid="blockButton"]').click();
  //     cy.get('[data-testid="ok-button"]').click({ force: true });
  //     cy.wait(500);
  //     cy.get('[data-testid="app"]')
  //       .find("div")
  //       .should("contain", "Contact blocked successfully");

  //     // undo Block contact after test
  //     cy.get("[data-testid=staffManagementMenu]").click({force: true});
  //     cy.contains("Blocked Contacts").click({force: true});
  //     cy.get('[data-testid="searchInput"]').click().type(contact_name);
  //     cy.get("[data-testid=additionalButton]").first().click();
  //     cy.get('[data-testid="ok-button"]').click();
  //     cy.wait(500);
  //     cy.get('[data-testid="app"]')
  //       .find("div")
  //       .should("contain", "Contact unblocked successfully");
  //   });
  // });
});
