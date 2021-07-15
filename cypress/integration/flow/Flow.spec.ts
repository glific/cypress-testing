import {
  IntroFlowMessages,
  preventiveFlowMessages,
} from "../../support/flowMessageJson.js";

let contactName;

describe("Flow", () => {
  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/chat");

    cy.wait(500);
    cy.get('[data-testid="layout"]').then((body) => {
      if (body.find('[data-testid="clearIcon"]').length <= 0) {
        cy.get('[data-testid="simulatorIcon"]').click({ force: true });
        cy.get('[data-testid="beneficiaryName"]')
          .invoke("text")
          .then((txt) => {
            console.log(txt);
            contactName = txt;
            console.log(contactName);
          });
        cy.wait(500);
      }
    });
  });

  it("Test DG new contact and Intro leaf curl flow ", () => {
    cy.get('[data-testid="layout"]').then(() => {
      cy.wait(1000);
      if (cy.get("[data-testid=simulatorInput]").should("be.visible")) {
        // start dg new contact flow
        IntroFlowMessages.forEach((message) => {
          if (message.type === "sender") {
            console.log("send", message.message);
            if (!message.attachment) {
              cy.typeInSimulator(message.message);
              if (message.wait) cy.wait(message.wait);
            } else {
              cy.get('[data-testid="attachment"]').click();
              cy.wait(1000);
              cy.get("[data-testid=messageType]")
                .contains(message.attachment)
                .click({ force: true });
            }
          } else cy.checkResponseInSimulator(message.message);
        });

        // release simulator
        cy.get('[data-testid="clearIcon"]').click();

        // check contact in collection
        cy.get("[data-testid=staffManagementMenu]").click();
        cy.get('[data-testid="MenuItem"]')
          .first()
          .contains("Collections")
          .click();
        cy.get('[data-testid="searchInput"]').type("Farmer").type("{enter}");
        cy.get('[data-testid="label"]').should("contain", "Farmer");
        cy.get('[data-testid="listHeader"]')
          .next()
          .contains("View Details")
          .click();
        cy.wait(1000);
        cy.get("[data-testid=tableHead]")
          .should("not.be.empty")
          .then(() => {
            cy.get('[data-testid="searchInput"]')
              .type(contactName)
              .type("{enter}");
            cy.get("[data-testid=tableBody]").should("contain", contactName);
          });
      }
    });
  });

  it("should check DG curavtive/preventive flow", () => {
    cy.get('[data-testid="layout"]').then(() => {
      // cy.wait(1000);
      if (cy.get("[data-testid=simulatorInput]").should("be.visible")) {
        // start curative/preventive flow
        preventiveFlowMessages.forEach((message) => {
          if (message.type === "sender") {
            if (!message.attachment) {
              cy.typeInSimulator(message.message);
              if (message.wait) cy.wait(message.wait);
            } else {
              cy.get('[data-testid="attachment"]').click();
              cy.wait(1000);
              cy.get("[data-testid=messageType]")
                .contains(message.attachment)
                .click({ force: true });
            }
          } else cy.checkResponseInSimulator(message.message);
        });
        // release simulator
        cy.get('[data-testid="clearIcon"]').click();
      }
      cy.get("[data-testid=searchInput]").type(contactName).type("{enter}");
      cy.get('[data-testid="name"]').first().click({ force: true });
      let ID;
      // hit the url
      cy.location().should((location) => {
        ID = location.href.split("/")[4];
        cy.visit(`/contact-profile/${ID}`);
      });
      cy.get('[data-testid="contactDescription"] > :nth-child(4)').should(
        "contain",
        "Crop_stage"
      );
    });
  });
});
