describe("HSM Template", () => {
  const hsmTemplateName = "Sample HSM Templates " + +new Date();
  const sampleMessage = "This is a sample message";
  const imageURL = 'https://www.buildquickbots.com/whatsapp/media/sample/jpg/sample01.jpg';
  const documentURL = 'https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample01.pdf';
  const videoURL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4';
  const audioURL = 'https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg';
  const stickerURL = 'https://www.buildquickbots.com/whatsapp/media/sample/jpg/sample01.jpg';

  beforeEach(function () {
    // login before each test
    cy.login();
    cy.visit("/template");
  });

  it("should load template list", () => {
    cy.get("h5").should("contain", "Templates");
  });

  it("should check validation", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(1000);
    cy.get('[data-testid="submitActionButton"]').click();
    cy.contains("Title is required.");
    cy.contains("Message is required.");
    cy.contains("Example is required.");
    cy.contains("Element name is required.");
  });

  it("should create new HSM template", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(1000);
    cy.get("input[name=label]").click().wait(500).type(hsmTemplateName);

    cy.get(":nth-child(4) > .MuiFormControl-root > [data-testid=outlinedInput]")
      .click({ force: true })
      .type("Test message");
    cy.get(":nth-child(5) > .MuiFormControl-root > [data-testid=outlinedInput]")
      .click({ force: true })
      .type("Test message");

    cy.get("[data-testid=formLayout] > :nth-child(6)").type("ACCOUNT_UPDATE");
    cy.contains("ACCOUNT_UPDATE").click();

    cy.get(
      ":nth-child(7) > .MuiFormControl-root > [data-testid=outlinedInput] > .MuiInputBase-input"
    )
      .click()
      .type("sample_templates");

    cy.get('[data-testid="submitActionButton"]').click();
    // It needs Gupshup setting enabled
    // cy.get(".MuiDialogContent-root").should("contain", "BSP response status");
    // cy.get("div").should("contain", "HSM Template created successfully");
  });

  // Currently to create hsm we need WhatsApp Business is Approved
  // edit and delete will work only if the HSM template is present

  // it("should edit hsm template", () => {
  //   cy.get("input[name=searchInput]")
  //     .click()
  //     .wait(500)
  //     .type(hsmTemplateName + "{enter}");
  //   cy.get("[data-testid=EditIcon]").click();
  //   cy.get('[data-testid="submitActionButton"]').click();
  //   cy.get("div").should("contain", "HSM Template edited successfully");
  // });

  // it("should delete hsm template", () => {
  //   cy.get("input[name=searchInput]")
  //     .click()
  //     .wait(500)
  //     .type(hsmTemplateName + "{enter}");
  //   cy.get("[data-testid=DeleteIcon]").click();
  //   cy.contains("Confirm").click();
  //   cy.get("div").should("contain", "HSM Template deleted successfully");
  // });

  it("should show typed sample message in simulator", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(1000);
    cy.get("input[name=label]").click().wait(500).type(hsmTemplateName);

    cy.get(":nth-child(5) > .MuiFormControl-root > [data-testid=outlinedInput]").click().type(sampleMessage).blur({ force: true });
    cy.get('html').click();
    cy.wait(1000);
    cy.get(".Simulator_ReceivedMessage__HGUkF").should("contain", sampleMessage);
  });

  it("should show attached image with the sample message as caption", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(1000);
    
    cy.get(":nth-child(8) > .MuiFormControl-root").click({ force: true }).type('IMA')
    cy.contains('IMAGE').click();
    cy.get(":nth-child(9) > .MuiFormControl-root").click().type(imageURL);

    cy.get(":nth-child(5) > .MuiFormControl-root > [data-testid=outlinedInput]").click().type(sampleMessage).blur({ force: true });
    cy.get('html').click();
    cy.wait(5000);

    cy.get('[data-testid=imageMessage] > img').should('have.attr','src', imageURL);
    cy.get(".Simulator_ReceivedMessage__HGUkF").should("contain", sampleMessage);

  });

  it("should show attached document with the sample message as caption", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(1000);
    
    cy.get(":nth-child(8) > .MuiFormControl-root").click({ force: true }).type('DOC')
    cy.contains('DOCUMENT').click();
    cy.get(":nth-child(9) > .MuiFormControl-root").click().type(documentURL);

    cy.get(":nth-child(5) > .MuiFormControl-root > [data-testid=outlinedInput]").click().type(sampleMessage).blur({ force: true });
    cy.get('html').click();
    cy.wait(5000);

    cy.get(".ChatMessageType_DocumentText__1j_QQ").should('have.attr', 'href', documentURL);
    cy.get(".Simulator_ReceivedMessage__HGUkF").should("contain", sampleMessage);

  });

  it("should show attached video with the sample message as caption", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(1000);

    cy.get(":nth-child(8) > .MuiFormControl-root").click({ force: true }).type('VID')
    cy.contains('VIDEO').click();
    cy.get(":nth-child(9) > .MuiFormControl-root").click().type(videoURL).type('{enter}');

    cy.get(":nth-child(5) > .MuiFormControl-root > [data-testid=outlinedInput]").click().type(sampleMessage).blur({ force: true });
    cy.get('html').click();
    cy.wait(1000);
    cy.get('[data-testid=videoMessage] > .ChatMessageType_Image__1bMAz');
    
    cy.get(".Simulator_ReceivedMessage__HGUkF").should("contain", sampleMessage);
    
  });

  it("should show attached audio", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(1000);


    cy.get(":nth-child(8) > .MuiFormControl-root").click({ force: true }).type('AUD')
    cy.contains('AUDIO').click();
    cy.get(":nth-child(9) > .MuiFormControl-root").click().type(audioURL);
    cy.get('html').click();
    cy.wait(5000);

    cy.get('[data-testid=audioMessage] > source');
    cy.should('have.attr', 'src', audioURL);
  });

  it("should show attached sticker", () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.wait(1000);

    cy.get(":nth-child(8) > .MuiFormControl-root").click({ force: true }).type('STI')
    cy.contains('STICKER').click();
    cy.get(":nth-child(9) > .MuiFormControl-root").click().type(stickerURL);
    cy.get('html').click();
    cy.wait(5000);

    cy.get('[data-testid=stickerMessage]');
    cy.should('have.attr', 'src', stickerURL);
    
  });

});


