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
      let url;

      cy.location().should((location) => {
        url = location.href;
        ID = url.split("/")[4];
        cy.visit(`/contact-profile/${ID}`);
      });
      cy.get('[data-testid="contactDescription"] > :nth-child(4)').should(
        "contain",
        "Crop_stage"
      );
      cy.get('[data-testid="contactDescription"] > :nth-child(4)').should(
        "contain",
        "Total_days"
      );
      cy.get('[data-testid="contactDescription"] > :nth-child(4)')
        .should("contain", "Next_flow")
        .next()
        .should("contain", "adoption");
      cy.get('[data-testid="collections"]').should("contain", "Farmer");
      cy.get('[data-testid="collections"]').should(
        "not.contain",
        "leaf curl check"
      );
    });
  });

  it("should start DG daily flow for the farmer group ", () => {
    cy.get('[data-testid="layout"]').then(() => {
      // release simulator first
      cy.get('[data-testid="clearIcon"]').click();

      cy.get(":nth-child(2) > a > .Chat_Title__1I4xo").click({ force: true });
      cy.get("[data-testid=searchInput]").type("Farmer").type("{enter}");
      cy.get('[data-testid="name"]').last().click();
      cy.wait(1000);
      cy.get('[data-testid="dropdownIcon"]').click();
      cy.get('[data-testid="flowButton"]').click();
      cy.get('[data-testid="dropdown"]')
        .click()
        .should("contain", "DG daily flow")
        .click();
      cy.get('[data-testid="ok-button"]').click();
    });
  });
});
