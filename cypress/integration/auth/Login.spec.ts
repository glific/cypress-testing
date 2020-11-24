describe("Login page", () => {
  const phone = Cypress.env("phone");
  const password = Cypress.env("password");

  it("Load the login page", () => {
    cy.visit("/");
    cy.get("h4").should("contain", "Login to your account");
  });

  it("Check validations", () => {
    cy.contains("LOGIN").click();
    cy.get("p").should("contain", "Input required");
  });

  // some issue in this case, need to check
  it("Successful login", () => {
    cy.get("input[type=tel]").type(phone);
    cy.get("input[type=password]").type(password);
    cy.get('[data-testid="SubmitButton"]').click();
    cy.get("div").should("contain", "Chats");
  });
});
