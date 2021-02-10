describe("Flow", () => {
  const flow = "test " + +new Date();
  const flow2 = "test2 " + +new Date();
  const randomFlowKeyword = () => {
    var keyword = "";
    var allowed_characters = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 10; i++)
      keyword += allowed_characters.charAt(
        Math.floor(Math.random() * allowed_characters.length)
      );
    return keyword;
  };

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
    cy.get("[data-testid=outlinedInput]")
      .eq(1)
      .click()
      .wait(500)
      .type(randomFlowKeyword());
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("div").should("contain", "Flow created successfully!");
  });

  // Need to fix
  // it("should configure Flow", () => {
  //   cy.get("input[name=searchInput]")
  //     .click()
  //     .wait(500)
  //     .type(flow + "{enter}");
  //   cy.get("[data-testid=additionalButton]").eq(0).click();
  //   Cypress.on("uncaught:exception", (err, runnable) => {
  //     // returning false here prevents Cypress from
  //     // failing the test
  //     return false;
  //   });
  //   cy.wait(1000);
  //   cy.contains("Create Message", { timeout: 10000 }).click();
  //   cy.get("temba-completion")
  //     .shadow()
  //     .find("temba-field")
  //     .find("temba-textinput")
  //     .shadow()
  //     .find("div.input-container")
  //     .find("textarea[name=Message]")
  //     .click({ force: true })
  //     .type("Hi", { force: true });
  //   cy.contains("Ok").click();
  //   cy.contains("Publish").click();

  //   cy.get("[aria-describedby=alert-dialog-description]")
  //     .contains("Publish")
  //     .click();
  //   cy.get("div").should("contain", "The flow has been published");
  // });

  it("should create new Flow without keyword", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.get("[data-testid=outlinedInput]").eq(0).click().wait(500).type(flow2);
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("div").should("contain", "Flow created successfully!");
  });

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
    cy.screenshot();
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

    cy.get("[data-testid=resetButton]").click();
    cy.wait(1000);
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type(flow2 + "{enter}");
    cy.get("[data-testid=DeleteIcon]").click();
    cy.contains("Confirm").click();
    cy.get("div").should("contain", "Flow deleted successfully");
    cy.screenshot();
  });
});
