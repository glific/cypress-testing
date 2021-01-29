describe("Flow", () => {
    const flow = "test " + +new Date();

    beforeEach(function () {
        // login before each test
        cy.login();
        cy.visit("/chat");
    });

    it("should start simulator", () => {
        cy.get('[data-testid="simulatorIcon"]').click();
        cy.get("#simulator");
    });
});
