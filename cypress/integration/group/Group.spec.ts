describe("Group", () => {
  const groupName = "Sample Group " + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/group");
  });

  it("should load group list", () => {
    cy.get("h5").should("contain", "Groups");
  });

  it("should create new group", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(500); //It's not the best way to wait for the dom to load, we need to find a better solution.
    cy.get("input[name=label]").click().type(groupName);
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("div").should("contain", "Group created successfully!");
  });

  it("should edit group", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500) //It's not the best way to wait for the dom to load, we need to find a better solution.
      .type(groupName + "{enter}");
    cy.get("[data-testid=EditIcon]").click();
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("div").should("contain", "Group edited successfully!");
  });
  
  it("should add member to group", () => {
    cy.get("input[name=searchInput]").type(groupName + "{enter}");
    cy.get("[data-testid=additionalButton]").first().click();
    cy.get("[data-testid=autocomplete-element]").type("Simulator" + "{enter}").wait(500);
    cy.get(".MuiAutocomplete-option").first().click();
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get("div").should("contain", "1 contact added");
  });
  
  it("should remove member from group", () => {
    cy.get("input[name=searchInput]").type(groupName + "{enter}");
    cy.contains("View Details").click();
    cy.get('[data-testid="DeleteIcon"]').first().click({ force: true });
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get("div").should("contain", "Contact deleted successfully");
  });
  
  it("should delete group", () => {
    cy.get("input[name=searchInput]").type(groupName + "{enter}");
    cy.get("[data-testid=DeleteIcon]").click();
    cy.contains("Confirm").click();
    cy.get("div").should("contain", "Group deleted successfully");
  });
});
