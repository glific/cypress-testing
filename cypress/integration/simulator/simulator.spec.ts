describe("Flow", () => {
    const flow = "test " + +new Date();

    beforeEach(function () {
        // login before each testdata-testid="beneficiaryName"
        cy.login();
        cy.visit("/chat");
    });

    it("should start simulator", () => {
        cy.get('[data-testid="beneficiaryName"]').then((body) => {
            if (body[0].innerText !== "Simulator") {
                cy.get('[data-testid="simulatorIcon"]').click();
                cy.get("#simulator");
            }
        })
    });
    it("should trigger flow", () => {
        cy.get('[data-testid="beneficiaryName"]').then((body) => {
            if (body[0].innerText !== "Simulator") {
                cy.get('[data-testid="simulatorIcon"]').click();
                cy.get("#simulator");
            }
        })
        cy.get("[data-testid=simulatorInput]").click().wait(500).type("help" + "{enter}");
    });
});
