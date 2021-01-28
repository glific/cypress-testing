describe("Flow", () => {
  const flow = "test " + +new Date();
  const flow2 = "test2 " + +new Date();

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/flow");
  });

  it("should stop from changing the page without saving ", () => {
    cy.get('[data-testid="additionalButton"]').first().click();
    cy.on("uncaught:exception", (err, runnable) => {
      return false;
    });
    cy.get("#flow").find("#editor-container");
    cy.go("back");
    cy.get('[data-testid="dialogTitle"] > h2').should(
      "contain",
      "Do you want to navigate away without saving your changes?"
    );
  });

  it("should load Flow list", () => {
    cy.get("h5").should("contain", "Flows");
  });

  it("should check require field validation", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(500);
    cy.get("[data-testid=submitActionButton]").click({ force: true });
    cy.get("p").should("contain", "Name is required.");
  });

  it("should create new Flow with keyword", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.get("[data-testid=outlinedInput]").eq(0).click().wait(500).type(flow);
    cy.get("[data-testid=outlinedInput]").eq(1).click().wait(500).type(random_flow_keyword());
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("div").should("contain", "Flow created successfully!");
    function random_flow_keyword() {
      var keyword = "";
      var allowed_characters = "abcdefghijklmnopqrstuvwxyz";
  
      for (var i = 0; i < 10; i++)
        keyword += allowed_characters.charAt(Math.floor(Math.random() * allowed_characters.length));
  
      return keyword;
    }
  });

  // it("should configure Flow", () => {
  //   cy.get("input[name=searchInput]")
  //     .click()
  //     .wait(500)
  //     .type("test 1610377688443" + "{enter}");
  //   cy.get("[data-testid=additionalButton]").eq(0).click();
  //   Cypress.on("uncaught:exception", (err, runnable) => {
  //     // returning false here prevents Cypress from
  //     // failing the test
  //     return false;
  //   });
  //   cy.contains("Create Message").click();
  //   // cy.contains("Send the contact a message").click();
  //   // cy.get("temba-completion").find("textarea").type("Test flow");
  //   cy.get("[data-testid=temba_select_type]").children(".left-side").click();
  //   cy.contains("Ok").click();
  //   // cy.get('[data-testid="submitActionButton"]').click({ force: true });
  // });

  it("should check duplicate new Flow", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.get("[data-testid=outlinedInput]").eq(0).click().wait(500).type(flow);
    cy.wait(1000);
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("p").should("contain", "Name already exists.");
  });

  it("should edit Flow", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(flow + "{enter}");
    cy.get("[data-testid=EditIcon]").click();
    cy.get('[data-testid="submitActionButton"]').click();
    cy.get("div").should("contain", "Flow edited successfully!");
  });

  it("should create duplicate Flow", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(flow + "{enter}");
    cy.get("[data-testid=additionalButton]").eq(1).click();
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
  });

  it("should delete Flow", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type("Copy of " + flow + "{enter}");
    cy.get("[data-testid=DeleteIcon]").click();
    cy.contains("Confirm").click();
    cy.get("div").should("contain", "Flow deleted successfully");

    cy.get("[data-testid=resetButton]").click();
    cy.wait(1000);
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(flow + "{enter}");
    cy.get("[data-testid=DeleteIcon]").click();
    cy.contains("Confirm").click();
    cy.get("div").should("contain", "Flow deleted successfully");
  });
});
