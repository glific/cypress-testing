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

  it("should create new tag", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get('[data-testid="input"]').first().within(($form) => {
      cy.get("p").contains("Title is required.");
    })
    cy.get('[data-testid="input"]').eq(1).within(($form) => {
      cy.get("p").contains("Description is required.");
    })
    cy.get("input[name=label]").click().type(tagName);
    cy.get("textarea[name=description]").click().type("This is random tag description");
    cy.get("textarea[name=keywords]").click().type("Test,Demo");
    cy.get('[data-testid="autocomplete-element"]')
      .first()
      .click()
      .type("Important");
    cy.get(".MuiAutocomplete-option").then((tagPresent) => {
      if (tagPresent.length > 0) {
        cy.get(".MuiAutocomplete-option").first().click();
      }
    })
    cy.get('[data-testid="submitActionButton"]').click();
    cy.contains("Tag created successfully");
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(tagName + "{enter}");
    cy.contains(tagName);
    cy.get("[data-testid=EditIcon]").click();
  });

  it("should edit tag", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(tagName + "{enter}");
    cy.get('[data-testid=EditIcon]').click();
    cy.get("textarea[name=description]").click().clear().type("This is the test description.");
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("div").contains("Tag edited successfully");
  });

  it("should delete tag", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(tagName + "{enter}");
    cy.get('[data-testid=DeleteIcon]').click();
    cy.contains("Confirm").click();
    cy.get("div").contains("Tag deleted successfully");
  });

  it("should give empty result after deleting the tag", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(tagName + "{enter}");
    cy.get('[data-testid="tableBody"]').should('be.empty');
  });
});
