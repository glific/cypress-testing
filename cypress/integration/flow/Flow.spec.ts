describe("Flow", () => {
  beforeEach(function () {
    cy.login();
    cy.visit("/chat");

    cy.wait(500);
    cy.get('[data-testid="layout"]').then((body) => {
      if (body.find('[data-testid="clearIcon"]').length <= 0) {
        cy.get('[data-testid="simulatorIcon"]').click();
      }
    });
  });

  it("Test DG new contact flow", () => {
    cy.get('[data-testid="layout"]').then((body) => {
      if (body.find('[data-testid="clearIcon"]').length > 0) {
        cy.get('[data-testid="beneficiaryName"]')
          .should("be.visible")
          .then(() => {
            // start dg new contact flow
            cy.typeInSimulator("dgnewcontact");
            // language flow

            cy.checkResponseInSimulator(
              "Your language is currently set at English"
            );
            cy.typeInSimulator("2");
            // optin flow
            cy.checkResponseInSimulator("Welcome to our NGO bot.");

            cy.typeInSimulator("1");
            // Intro leaf curl check flow
            cy.checkResponseInSimulator(
              "Thank you for giving us the permission. We really appreciate it."
            );

            cy.checkResponseInSimulator(
              "Are you seeing any leaf curl symptoms in your chilli crop as shown in the above image?"
            );

            cy.typeInSimulator("yes");

            // preventive flow
            cy.checkResponseInSimulator(
              "Tell us if your crop is in any of the following stages"
            );

            cy.typeInSimulator("1");

            // curative flow

            cy.wait(1000);
            cy.checkResponseInSimulator(
              "Please share images of the impacted crop."
            );
            cy.typeInSimulator("1"); // instead of sending an image we are sending some number

            cy.checkResponseInSimulator("Thank you");

            // start weather updates flow with keyword
            cy.typeInSimulator("weatherupdates");
            cy.checkResponseInSimulator("Are you interested?");
            cy.typeInSimulator("1");

            // start weather flow
            cy.checkResponseInSimulator(
              "Send us a voice note to tell us in which village or town name"
            );
            // cy.wait(60000);
            // cy.wait(10000);

            // // instead of sending voice message we will not send any response and see the next message
            // cy.get("[data-testid=simulatedMessages]").should(
            //   "contain",
            //   "Tell us in which village or town your farm is located?"
            // );
            // cy.typeInSimulator("Narwa");
          });
      }
    });
  });

  it("should start DG Leaf curl check flow", () => {
    cy.get('[data-testid="layout"]').then((body) => {
      if (body.find('[data-testid="clearIcon"]').length > 0) {
        cy.typeInSimulator("leafcurlcheck");
        cy.checkResponseInSimulator(
          "Hi, Are you seeing any leaf curl symptoms like yellowing of leaves, or wilting in your Chilli crop ?"
        );
        cy.typeInSimulator("yes");
        cy.typeInSimulator("1");
        cy.typeInSimulator("1");
      }
    });
  });
});
