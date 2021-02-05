describe("Group", () => {
  const collectionName = "Sample Collection " + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/collection");
  });

  it("should create new collection", () => {
    cy.create_collection(collectionName);
  });

  it("should load collection list", () => {
    cy.get('[data-testid="label"]').contains(collectionName);
  });

  it("should edit collection", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500) //It's not the best way to wait for the dom to load, we need to find a better solution.
      .type(collectionName + "{enter}");
    cy.get("[data-testid=EditIcon]").click();
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("div").should("contain", "Collection edited successfully!");
  });

  it("should add member to collection", () => {
    cy.get("input[name=searchInput]").type(collectionName + "{enter}");
    cy.get("[data-testid=additionalButton]").first().click();
    cy.get("[data-testid=autocomplete-element]").type("Simulator" + "{enter}").wait(500);
    cy.get(".MuiAutocomplete-option").first().click();
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get("div").should("contain", "1 contact added");
  });

  it("should remove member from collection", () => {
    cy.get("input[name=searchInput]").type(collectionName + "{enter}");
    cy.contains("View Details").click();
    cy.get('[data-testid="DeleteIcon"]').first().click({ force: true });
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get("div").should("contain", "Contact deleted successfully");
  });

  it("should delete collection", () => {
    cy.get("input[name=searchInput]").type(collectionName + "{enter}");
    cy.get("[data-testid=DeleteIcon]").click();
    cy.contains("Confirm").click();
    cy.get("div").should("contain", "Collection deleted successfully");
  });
});
