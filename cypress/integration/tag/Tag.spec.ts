describe("Tag", () => {
  const tagName = "Sample Tag_" + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/tag");
  });

  it("should load tag list", () => {
    cy.get("h5").should("contain", "Tags");
  });

  it("should check validation", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(500);
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("p").eq(0).should("contain", "Title is required.");
    cy.get("p").eq(1).should("contain", "Description is required.");
  });

  it("should create new tag", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.get("input[name=label]").click().wait(500).type(tagName);
    cy.get("textarea[name=description]")
      .click()
      .type("This is random tag description");
    cy.get("textarea[name=keywords]").click().type("Test,Demo");
    cy.get('[data-testid="autocomplete-element"]')
      .first()
      .click()
      .type("Important");
    cy.get(".MuiAutocomplete-option").then((tagPresent) => {
      if (tagPresent.length > 0) {
        cy.get(".MuiAutocomplete-option").first().click();
      }
    });
    cy.get('[data-testid="submitActionButton"]').click();
    cy.wait(2000);
    cy.get(".MuiAlert-message").should("contain", "Tag created successfully");
  });

  it("should redirect to tag list", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(tagName + "{enter}");
    cy.get("div").should("contain", tagName);
    cy.get("[data-testid=EditIcon]").click();
    // should go to tag list on click of CANCEL
    cy.get('[data-testid="cancelActionButton"]').click();
    cy.get("h5").should("contain", "Tags");
  });

  it("should edit tag", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(tagName + "{enter}");
    cy.get("[data-testid=EditIcon]").click();
    cy.get("textarea[name=description]")
      .click()
      .clear()
      .type("This is the test description.");
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("div").should("contain", "Tag edited successfully");
  });

  it("should delete tag", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(tagName + "{enter}");
    cy.get("[data-testid=DeleteIcon]").click();
    cy.contains("Confirm").click();
    cy.wait(2000);
    cy.get("div").should("contain", "Tag deleted successfully");
  });

  it("should give empty result after deleting the tag", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(tagName + "{enter}");
    cy.get('[data-testid="tableBody"]').should("be.empty");
  });
});
