import {
  IntroFlowMessages,
  preventiveFlowMessages,
} from "../../support/flowMessageJson.js";

let contactName: any;
let credentials: any;

describe("Flow", () => {
  beforeEach(function () {
    if (credentials) {
      localStorage.setItem("glific_session", credentials);
      localStorage.setItem(
        "glific_user",
        JSON.stringify({ organization: { id: "1" }, roles: ["Glific_admin"] })
      );
    } else {
      cy.login().then((value) => {
        credentials = value;
      });
    }
    cy.visit("/chat");

    cy.wait(500);
    cy.get('[data-testid="layout"]').then((body) => {
      if (body.find('[data-testid="clearIcon"]').length <= 0) {
        cy.get('[data-testid="simulatorIcon"]').click({ force: true });
        cy.get('[data-testid="beneficiaryName"]')
          .invoke("text")
          .then((txt) => {
            contactName = txt;
          });
        cy.wait(500);
      }
    });
  });

  it("Test DG new contact and Intro leaf curl flow ", () => {
    cy.get('[data-testid="layout"]').then(() => {
      cy.wait(1000);
      //before starting flow check contact in collection and remove it
      cy.removeFromFarmerCollection();

      if (cy.get("[data-testid=simulatorInput]").should("be.visible")) {
        // start dg new contact flow
        IntroFlowMessages.forEach((message) => {
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

        // check contact in collection
        cy.checkContactInCollection("Farmer", contactName);
      }
    });
  });

  it("should check DG curavtive/preventive flow", () => {
    cy.get('[data-testid="layout"]').then(() => {
      // cy.wait(1000);
      if (cy.get("[data-testid=simulatorInput]").should("be.visible")) {
        // start curative/preventive flow
        preventiveFlowMessages.forEach((message: any) => {
          if (message.type === "sender") {
            if (message.message) {
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
      // go to contact profile
      cy.get("[data-testid=searchInput]").type(contactName).type("{enter}");
      cy.get('[data-testid="name"]').first().click({ force: true });
      let ID: any;
      let url: any;
      cy.location().should((location) => {
        url = location.href;
        if (url) {
          ID = url.split("/")[4];
          cy.visit(`/contact-profile/${ID}`);
          cy.wait(2000);
        }
      });
      cy.get("[data-testid=contactDescription] > :nth-child(4)").contains(
        "crop_stage"
      );

      cy.get('[data-testid="contactDescription"] > :nth-child(4)').should(
        "contain",
        "total_days"
      );
      cy.get('[data-testid="contactDescription"] > :nth-child(4)')
        .should("contain", "next_flow")
        .last()
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

      cy.startFlowForGroup("Farmer", "DG daily flow");

      // check contact in collection
      cy.checkContactInCollection("adoption", contactName);

      cy.wait(1000);

      // go to contact profile
      cy.get("[data-testid=searchInput]").type(contactName).type("{enter}");
      cy.get('[data-testid="name"]').first().click({ force: true });
      let ID: any;
      let url: any;
      cy.location().should((location) => {
        url = location.href;
        if (url) {
          ID = url.split("/")[4];
          cy.visit(`/contact-profile/${ID}`);
          cy.wait(2000);
        }
      });
      cy.get('[data-testid="contactDescription"] > :nth-child(4)')
        .should("contain", "total_days")
        .last()
        .should("contain", "17");
      cy.get('[data-testid="collections"]').should(
        "not.contain",
        "leaf curl check"
      );
    });
  });

  it("should run adoption flow for group", () => {
    cy.get('[data-testid="layout"]').then(() => {
      // release simulator first
      cy.get('[data-testid="clearIcon"]').click();

      cy.startFlowForGroup("adoption", "DG Adoption Flow");

      // check if contact is been removed from adoption flow
      cy.get(":nth-child(1) > a > .Chat_Title__1I4xo").click({ force: true });
      cy.get("[data-testid=searchInput]").type(contactName).type("{enter}");
      cy.get('[data-testid="name"]').first().click({ force: true });
      let ID: any;
      let url: any;
      cy.location().should((location) => {
        url = location.href;
        if (url) {
          ID = url.split("/")[4];
          cy.visit(`/contact-profile/${ID}`);
          cy.wait(2000);
        }
      });
      cy.get('[data-testid="contactDescription"] > :nth-child(4)')
        .should("contain", "next_flow")
        .last()
        .should("contain", "leaf curl check");
    });
    cy.get('[data-testid="collections"]').should("not.contain", "adoption");
  });

  it("should run daily flow again", () => {
    cy.get('[data-testid="layout"]').then(() => {
      // release simulator first
      cy.get('[data-testid="clearIcon"]').click();

      cy.startFlowForGroup("Farmer", "DG daily flow");

      // check in leaf curl check again flow
      cy.checkContactInCollection("leaf curl check again", contactName);
    });
  });
});
