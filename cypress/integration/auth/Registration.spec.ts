describe("Registration page", () => {
  const phone = Cypress.env("phone");
  const password = Cypress.env("password");

  it("Load the forgot password page", () => {
    cy.visit("/registration");
    cy.get("h4").should("contain", "Create your new account");
  });

  it("Check validations", () => {
    cy.get('[data-testid="SubmitButton"]').click();
    cy.get("p").should("contain", "Input required");
  });

  it("Submit Registration form", () => {
    cy.get("input[type=text]").type("Test User");
    cy.get("input[type=tel]").type(phone);
    cy.get("input[type=password]").type(password);
    cy.get('[data-testid="SubmitButton"]').click();
    cy.get("div").should(
      "contain",
      "We are unable to register, kindly contact your technical team."
    );
  });

  // it("Redirect to login form", () => {
  //   cy.contains("LOGIN TO GLIFIC").click();
  //   cy.get("h4").should("contain", "Login to your account");
  // });
});
