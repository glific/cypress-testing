describe("Collections", () => {
  const collection = "test " + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/collection");
  });

  it("should load collection list", () => {
    cy.get("h5").should("contain", "Collections");
  });

  it("should check require field validation", () => {
    cy.get('[data-testid="newItemButton"]').click();

    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("p").should("contain", "Title is required.");
    cy.get("p").should("contain", "Description is required.");
  });

  it("should create new collection", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.get("[data-testid=outlinedInput]").eq(0).click().type(collection);
    cy.get("[data-testid=outlinedInput]").eq(1).click().type(collection);
    cy.get('[data-testid="AutocompleteInput"]')
      .first()
      .click()
      .type("Important");
    cy.get(".MuiAutocomplete-option").first().click();
    cy.get('[data-testid="AutocompleteInput"]')
      .eq(1)
      .click({ force: true })
      .type("Group");
    cy.get(".MuiAutocomplete-option").first().click();
    cy.get('[data-testid="AutocompleteInput"]')
      .eq(2)
      .click({ force: true })
      .type("Glific");
    cy.get(".MuiAutocomplete-option").first().click();
    cy.get('[data-testid="date-picker-inline"]')
      .eq(0)
      .click({ force: true })
      .type("01/01/2021");
    cy.get('[data-testid="date-picker-inline"]')
      .eq(1)
      .click({ force: true })
      .type("01/31/2021");

    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("div").should("contain", "Collection created successfully!");
  });

  it("should edit collection", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(collection + "{enter}");
    cy.get("[data-testid=EditIcon]").click();
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("div").should("contain", "Collection edited successfully!");
  });

  it("should delete collection", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(collection + "{enter}");
    cy.get("[data-testid=DeleteIcon]").click();
    cy.contains("Confirm").click();
    cy.get("div").should("contain", "Collection deleted successfully");
  });
});
