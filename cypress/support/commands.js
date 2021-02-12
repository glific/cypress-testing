// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
Cypress.on("uncaught:exception", (err) => {
  // returning false here prevents Cypress from
  // failing the test
  expect(err.message).to.include("Ignoring error for now");
  return false;
});

// -- login command --
Cypress.Commands.add(
  "login",
  (phone = "91" + Cypress.env("phone"), password = Cypress.env("password")) => {
    return cy
      .request({
        method: "POST",
        url: Cypress.env("backendUrl"),
        body: {
          user: {
            phone: phone,
            password: password,
          },
        },
      })
      .then((response) => {
        const session = JSON.stringify(response.body.data);
        localStorage.setItem("glific_session", session);
        localStorage.setItem(
          "glific_user",
          JSON.stringify({ organization: { id: "1" }, roles: ["Admin"] })
        );
      });
  }
);
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
