describe("Flow", () => {
  const flow = "test " + +new Date();
  const flow_hindi = "परिक्षण " + +new Date();
  const flow_with_no_keyword = "test2 " + +new Date();
  const flow_new = "test3 " + +new Date();

  const randomFlowKeyword_en = () => {
    var keyword = "";
    var allowed_characters = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 10; i++)
      keyword += allowed_characters.charAt(
        Math.floor(Math.random() * allowed_characters.length)
      );
    return keyword;
  };
  const randomFlowKeyword_hi = () => {
    var keyword = "";
    var allowed_characters =
      "कखगघङचछजझञाटठडढणतथदधनपफबभमयरलवशषसहअआइईउऊऋएऐओऔक्षत्रज्ञ१२३४५६७८९०";
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
      .type(randomFlowKeyword_en());
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("div").should("contain", "Flow created successfully!");
  });

  it("should create new Flow in hindi", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.get("[data-testid=outlinedInput]")
      .eq(0)
      .click()
      .wait(500)
      .type(flow_hindi);
    cy.get("[data-testid=outlinedInput]")
      .eq(1)
      .click()
      .wait(500)
      .type(randomFlowKeyword_hi());
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("div").should("contain", "Flow created successfully!");
  });

  it("should create new Flow without keyword", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.get("[data-testid=outlinedInput]")
      .eq(0)
      .click()
      .wait(500)
      .type(flow_with_no_keyword);
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("div").should("contain", "Flow created successfully!");
  });

  it("should check duplicate new Flow", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.get("[data-testid=outlinedInput]")
      .eq(0)
      .click()
      .wait(500)
      .type("arcane");
    cy.wait(1000);
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.wait(1000);
    cy.get(".MuiDialogContent-root > p")
      .should("be.visible")
      .should("contain", "Sorry, the flow name already exists.");
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
    cy.get("[data-testid=additionalButton]").eq(1).click({ force: true });
    cy.get('[data-testid="submitActionButton"]').click({ force: true });
    cy.get("div").should("contain", "Copy of the flow has been created!");
  });

  it("should delete Flow", () => {
    cy.get("input[name=searchInput]")
      .click()
      .wait(500)
      .type("Copy of " + flow + "{enter}");
    cy.get("[data-testid=DeleteIcon]").click();
    cy.get('[data-testid="ok-button"]').click({ force: true });
    cy.get('[data-testid="tableBody"]').should("be.empty");
    cy.deleteFlow(flow);
    cy.deleteFlow(flow_with_no_keyword);
    cy.deleteFlow(flow_hindi);
  });

  // need to check
  // issue in selecting the second value from dropdown list

  // it("should configure Flow", () => {
  //   cy.get('[data-testid="newItemButton"]').click();
  //   cy.get("[data-testid=outlinedInput]").eq(0).click().wait(500).type(flow_new);
  //   cy.get('[data-testid="additionalActionButton"]').click({ force: true });
  //   cy.get("div").should("contain", "Flow created successfully!");
  //   Cypress.on("uncaught:exception", (err, runnable) => {
  //     return false;
  //   });
  //   cy.get('[data-testid="flowName"]').should("contain", flow_new);
  //   cy.wait(4000);
  //   cy.get("div").contains("Create Message").click({ force: true });
  //   cy.get("temba-completion")
  //     .shadow()
  //     .find("temba-field")
  //     .find("temba-textinput")
  //     .shadow()
  //     .find("div.input-container")
  //     .find("textarea[name=Message]")
  //     .click({ force: true })
  //     .type("Hi", { force: true });
  //   // WhatsApp section
  //   cy.get(".ReactModalPortal").contains("WhatsApp").click({ force: true });
  //   cy.fetchList();
  //   cy.selectFirstValFromList("Personalized Bill");
  //   cy.enterInput().type("PQR", { force: true });
  //   // Attachments section
  //   cy.get(".ReactModalPortal").contains("Attachments").click({ force: true });
  //   cy.fetchList();
  //   cy.selectFirstValFromList("Image URL");
  //   cy.enterInput().type("test", { force: true });
  //   cy.contains("Ok").click();
  //   // check URL validation
  //   cy.get(".ReactModalPortal")
  //     .contains("Not a valid image url")
  //     .click({ force: true });
  //   cy.enterInput()
  //     .clear({ force: true })
  //     .type(
  //       "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg",
  //       { force: true }
  //     );
  //   cy.contains("Ok").click();
  //   // publish flow
  //   cy.get('[data-testid="button"]').click();
  //   cy.get('[data-testid="ok-button"]').click({ force: true });
  //   cy.get('[data-testid="app"]').should(
  //     "contain",
  //     "The flow has been published"
  //   );
  // });

  // it("should configure Flow1", () => {
  //   cy.get("input[name=searchInput]")
  //     .click()
  //     .wait(500)
  //     .type(flow_with_no_keyword + "{enter}");
  //   cy.get('[data-testid="additionalButton"]').first().click();
  //   Cypress.on("uncaught:exception", (err, runnable) => {
  //     // returning false here prevents Cypress from
  //     // failing the test
  //     return false;
  //   });
  //   cy.wait(1000);
  //   cy.get('[data-testid="draggable_a4b5ba58-691d-4590-9c1b-ed29f2ebb47b"]').trigger("mouseover");
  //   cy.get('.Node_add__3PamH').click({force: true});
  //   cy.get('temba-select').shadow()
  //     .find('temba-field')
  //     .find('div.selected')
  //     .click({force: true})
  //   cy.get('temba-select').shadow()
  //     .find('temba-field')
  //     .find('temba-options').first().shadow()
  //     .find('.options-container')
  //     .find('.options')
  //     .find('div.option').contains('Wait for the contact to respond').click({force: true});
  // });
});
