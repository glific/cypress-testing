describe("Notification list ", () => {
  beforeEach(function () {
    cy.login();
    cy.visit("/notifications");
  });

  it("should show Notifications in sidebar", () => {
    cy.get(":nth-child(3) > [data-testid=list] > .Mui-selected").should(
      "contain",
      "Notifications"
    );
  });

  it("should load notification list", () => {
    cy.get("h5").should("contain", "Notifications");
    cy.get('[data-testid="tableBody"]').should("not.be.empty");
  });

  it("should show copy text and view menu after clicking entity ", () => {
    //   check if notifications are there
    cy.get('[data-testid="tableBody"]')
      .should("not.be.empty")
      .then(function () {
        cy.get(
          ":nth-child(1) > .NotificationList_Entity__3y9Vb > :nth-child(1) > [data-testid=Menu]"
        ).click({ force: true });

        cy.get("[data-testid=MenuItem]").should("contain", "Copy text");

        cy.get("[data-testid=MenuItem]").should("contain", "View");
        cy.get(
          ":nth-child(1) > .NotificationList_Entity__3y9Vb > :nth-child(1) > [data-testid=Menu]"
        ).click();

        cy.get("[data-testid=MenuItem]").should("contain", "Copy text");

        cy.get("[data-testid=MenuItem]")
          .should("contain", "View")
          .last()
          .click({ force: true });
        cy.get(".NotificationList_PopoverActions__1tbCG > .MuiButtonBase-root")
          .should("contain", "Done")
          .click();
      });
  });

  it("arrow should redirect to contact for category message ", () => {
    cy.get('[data-testid="tableBody"]')
      .should("not.be.empty")
      .then(function () {
        cy.get("[data-testid=table]")
          .contains("td", "Message")
          .next()
          .next()
          .next()
          .next()
          .click();
      });
  });

  it("arrow should redirect to perticular flow for category flow ", () => {
    cy.get('[data-testid="tableBody"]')
      .should("not.be.empty")
      .then(function () {
        cy.get("[data-testid=table]")
          .contains("td", "Flow")
          .next()
          .next()
          .next()
          .next()
          .click();
      });
  });
});
