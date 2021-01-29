describe("Flow", () => {
    beforeEach(function () {
        // login before each
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
    it("should trigger help flow", () => {
        cy.get('[data-testid="beneficiaryName"]').then((body) => {
            if (body[0].innerText !== "Simulator") {
                cy.get('[data-testid="simulatorIcon"]').click();
                cy.get("#simulator");
            }
        })
        const old_msg_count = cy.get('*[class^="Simulator_ReceivedMessage"]').its('length');
        cy.get("[data-testid=simulatorInput]").click().wait(500).type("help" + "{enter}");
        cy.get("[data-testid=simulatorInput]").click().wait(500).type("1" + "{enter}");
        const new_msg_count = cy.get('*[class^="Simulator_ReceivedMessage"]').its('length');
        expect(new_msg_count).to.not.equal(old_msg_count)
    });
    it("should trigger activity flow", () => {
        cy.get('[data-testid="beneficiaryName"]').then((body) => {
            if (body[0].innerText !== "Simulator") {
                cy.get('[data-testid="simulatorIcon"]').click();
                cy.get("#simulator");
            }
        })
        const old_msg_count = cy.get('*[class^="Simulator_ReceivedMessage"]').its('length');
        cy.get("[data-testid=simulatorInput]").click().wait(500).type("activity" + "{enter}");
        cy.get("[data-testid=simulatorInput]").click().wait(500).type("1" + "{enter}");
        const new_msg_count = cy.get('*[class^="Simulator_ReceivedMessage"]').its('length');
        expect(new_msg_count).to.not.equal(old_msg_count)
    });

});
