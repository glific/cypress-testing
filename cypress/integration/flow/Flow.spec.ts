import {
  messages,
  leafCurlFlowMessages,
  curativeFlowMessages,
} from "../../support/flowMessagesJson.js";

const yesWeatherAudio =
  "https://storage.cloud.google.com/user_inputs/%20(Yes)%20%20(weather).mp3";

const oneTo25Days =
  "https://storage.cloud.google.com/user_inputs/1-25%20days.mp3";

describe("Flow", () => {
  beforeEach(function () {
    cy.login();
    cy.visit("/chat");

    cy.wait(500);
    cy.get('[data-testid="layout"]').then((body) => {
      if (body.find('[data-testid="clearIcon"]').length <= 0) {
        cy.get('[data-testid="simulatorIcon"]').click();
        cy.wait(500);
      }
    });
  });

  it("Test DG new contact flow", () => {
    cy.get('[data-testid="layout"]').then(() => {
      cy.wait(1000);

      if (cy.get("[data-testid=simulatorInput]").should("be.visible")) {
        // this code clears all the previous messages. Not needed for now

        // cy.get('[data-testid="dropdownIcon"]').click();
        // cy.get('[data-testid="clearChatButton"]').click();
        // cy.get('[data-testid="dialogBox"] [data-testid="ok-button"]').click();
        // cy.wait(4000);
        // start dg new contact flow

        messages.forEach((message) => {
          const { wait, type, text, attachment } = message;
          if (wait) cy.wait(wait);
          if (type === "sender") {
            if (text) {
              cy.typeInSimulator(text);
            } else if (attachment) {
              cy.sendSimulatedAttachment(attachment.type, attachment.url);
            }
          } else cy.checkResponseInSimulator(text);
        });

        // release simulator
        cy.get('[data-testid="clearIcon"]').click();
      }
    });
  });
});

//   it("should check DG Leaf curl check flow", () => {
//     cy.get('[data-testid="layout"]').then(() => {
//       leafCurlFlowMessages.forEach((message) => {
//         if (message.type === "sender") {
//           if (!message.attachment) {
//             cy.typeInSimulator(message.message);
//             if (message.wait) cy.wait(message.wait);
//           } else {
//             cy.get('[data-testid="attachment"]').click();
//             cy.wait(1000);
//             cy.get("[data-testid=messageType]")
//               .contains(message.attachment)
//               .click({ force: true });
//           }
//         } else cy.checkResponseInSimulator(message.message);
//       });
//       // release simulator
//       cy.get('[data-testid="clearIcon"]').click();
//     });
//   });

//   it("should check DG curative flow", () => {
//     cy.get('[data-testid="layout"]').then(() => {
//       curativeFlowMessages.forEach((message) => {
//         if (message.type === "sender") {
//           if (!message.attachment) {
//             cy.typeInSimulator(message.message);
//             if (message.wait) cy.wait(message.wait);
//           } else {
//             cy.get('[data-testid="attachment"]').click();
//             cy.wait(1000);
//             cy.get("[data-testid=messageType]")
//               .contains(message.attachment)
//               .click({ force: true });
//           }
//         } else cy.checkResponseInSimulator(message.message);
//       });
//       // release simulator
//       cy.get('[data-testid="clearIcon"]').click();
//     });
//   });
// });
