describe('HSM Template V2', () => {
  const hsmTemplateName = 'sample_hsm_v2_' + Date.now();
  const sampleMessage = 'This is a sample message for HSMV2';
  const imageURL = 'https://www.buildquickbots.com/whatsapp/media/sample/jpg/sample01.jpg';
  const documentURL = 'https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample01.pdf';
  const videoURL =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4';

  const openCreatePage = () => {
    cy.get('[data-testid="newItemButton"]').click();
    cy.contains('Create a new HSM Template');
  };

  // Stubs the createSessionTemplate mutation so submission can be asserted without
  // needing a real, WhatsApp Business-approved backend. Every other request (login,
  // categories, tags, languages, ...) passes through to the real backend untouched.
  const interceptCreateTemplate = (shortcode: string) => {
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'createSessionTemplate') {
        req.alias = 'createTemplate';
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createSessionTemplate: {
                sessionTemplate: {
                  __typename: 'SessionTemplate',
                  id: '999999',
                  label: null,
                  body: sampleMessage,
                  footer: null,
                  isActive: true,
                  language: { __typename: 'Language', label: 'English', id: '1' },
                  translations: null,
                  type: 'TEXT',
                  MessageMedia: null,
                  category: 'UTILITY',
                  shortcode,
                  example: sampleMessage,
                  hasButtons: false,
                  buttons: null,
                  buttonType: null,
                },
                errors: null,
                __typename: 'SessionTemplateResult',
              },
            },
          },
        });
      } else {
        req.continue();
      }
    });
  };

  beforeEach(function () {
    cy.login();
    cy.visit('/template-v2');
  });

  it('should load HSM template list', () => {
    cy.get('[data-testid="listHeader"]').should('contain', 'HSM Templates');
    cy.get('[data-testid="newItemButton"]').should('be.visible');
    cy.get('[data-testid="syncHsm"]').should('be.visible');
  });

  it('should filter templates by status', () => {
    cy.get('[data-testid="dropdown-template"]').click();
    cy.get('[data-testid="template-item"]').contains('Pending').click({ force: true });
    cy.get('html').click();
    cy.get('[data-testid="dropdown-template"]').should('contain', 'Pending');
  });

  it('should filter templates by category', () => {
    cy.get('[data-testid="categoryFilter"]').click();
    cy.contains('li', 'Utility').click({ force: true });
    cy.get('[data-testid="categoryFilter"]').should('contain', 'Utility');
  });

  it('should navigate to the create page on clicking Create', () => {
    openCreatePage();
    cy.location('pathname').should('eq', '/template-v2/add');
  });

  it('should check validation', () => {
    openCreatePage();
    cy.get('[data-testid="submitActionButton"]').click();
    cy.contains('Element name is required.');
    cy.contains('Message is required.');
  });

  it('should select a language', () => {
    openCreatePage();
    cy.get('[data-testid="AutocompleteInput"] input').eq(0).click().clear().type('Hindi');
    cy.contains('Hindi').click({ force: true });
    cy.get('[data-testid="AutocompleteInput"] input').eq(0).should('have.value', 'Hindi');
  });

  it('should type the element name', () => {
    openCreatePage();
    cy.get('input[name="newShortcode"]').click().type(hsmTemplateName);
    cy.get('input[name="newShortcode"]').should('have.value', hsmTemplateName);
  });

  it('should select a category', () => {
    openCreatePage();
    cy.contains('button', 'Utility').click();
    cy.contains('button', 'Marketing').should('be.visible').click();
  });

  it('should show typed sample message in simulator', () => {
    openCreatePage();

    cy.get('[data-testid="editor-body"]').click().type(sampleMessage).blur({ force: true });
    cy.get('[data-testid="beneficiaryName"]').click();
    cy.get('html').click();
    cy.get('[data-testid="simulatedMessages"] > div > div', { timeout: 10000 }).should(
      'contain',
      sampleMessage
    );
  });

  it('should apply bold formatting to the message', () => {
    openCreatePage();

    cy.get('[data-testid="editor-body"]').click().type(sampleMessage);
    cy.get('[data-testid="bold-icon"]').click();
    cy.get('[data-testid="italic-icon"]').should('be.visible');
    cy.get('[data-testid="strikethrough-icon"]').should('be.visible');
    cy.get('[data-testid="editor-body"]').should('contain', '**');
  });

  it('should add a variable to the message and set its value', () => {
    openCreatePage();

    cy.get('[data-testid="editor-body"]').click().type(sampleMessage);
    cy.contains('Add Variable').click();
    cy.get('[data-testid="variable"]').should('have.length', 1);
    cy.get('input[placeholder="Define value"]').type('User');
    cy.get('input[placeholder="Define value"]').should('have.value', 'User');
  });

  it('should add a footer to the template', () => {
    openCreatePage();
    cy.get('input[name="footer"]').click().type('This is a footer');
    cy.get('input[name="footer"]').should('have.value', 'This is a footer');
  });

  // ---------- Create page: Interactive Buttons -> Quick Reply ----------

  it('should select Quick Reply and show the live character count', () => {
    openCreatePage();

    cy.contains('button', 'Quick Reply').click();
    cy.contains('Maximum 10 quick reply buttons allowed per template');
    cy.get('input[placeholder="e.g., Yes, No, More Info"]').type('Yes');
    cy.contains('3 / 20');
  });

  it('should add and remove multiple quick reply buttons', () => {
    openCreatePage();

    cy.contains('button', 'Quick Reply').click();
    cy.get('[data-testid="addButton"]').click();
    cy.get('input[placeholder="e.g., Yes, No, More Info"]').should('have.length', 2);
    cy.get('[data-testid="delete-icon"]').should('have.length', 2);

    cy.get('[data-testid="delete-icon"]').eq(1).click();
    cy.get('input[placeholder="e.g., Yes, No, More Info"]').should('have.length', 1);
  });

  it('should clear the interactive button type selection', () => {
    openCreatePage();

    cy.contains('button', 'Quick Reply').click();
    cy.contains('Clear button selection').click();
    cy.contains('Clear button selection').should('not.exist');
  });

  // ---------- Create page: Interactive Buttons -> Call to Action ----------

  it('should add a Phone number Call to Action button', () => {
    openCreatePage();

    cy.contains('button', 'Call to Action').click();
    cy.contains('button', 'Phone number').click();
    cy.get('input[placeholder="e.g., Call Us"]').type('Call me');
    cy.get('input[placeholder="+91 98765 43210"]').type('9876543210');
    cy.get('input[placeholder="e.g., Call Us"]').should('have.value', 'Call me');
    cy.get('input[placeholder="+91 98765 43210"]').should('have.value', '9876543210');
  });

  it('should disable the Phone number chip once its limit is reached', () => {
    openCreatePage();

    cy.contains('button', 'Call to Action').click();
    cy.contains('button', 'Phone number').click();
    cy.contains('button', 'Phone number').should('be.disabled');
  });

  it('should reveal the Advanced section with Static and Dynamic URL options for a URL button', () => {
    openCreatePage();

    cy.contains('button', 'Call to Action').click();
    cy.contains('button', 'URL').click();
    cy.contains('Static URL').should('not.exist');

    cy.contains('Advanced').click();
    cy.contains('Static URL').should('be.visible');
    cy.contains('Dynamic URL').should('be.visible');
  });

  it('should show the Sample Suffix field when Dynamic URL is selected', () => {
    openCreatePage();

    cy.contains('button', 'Call to Action').click();
    cy.contains('button', 'URL').click();
    cy.contains('Advanced').click();
    cy.contains('Dynamic URL').click();

    cy.get('input[placeholder="Sample Suffix"]').should('be.visible').type('promo');
    cy.get('input[placeholder="Sample Suffix"]').should('have.value', 'promo');
  });

  it('should add and remove multiple Call to Action buttons', () => {
    openCreatePage();

    cy.contains('button', 'Call to Action').click();
    cy.contains('button', 'Phone number').click();
    cy.get('input[placeholder="e.g., Call Us"]').type('Call me');
    cy.get('input[placeholder="+91 98765 43210"]').type('9876543210');

    cy.get('[data-testid="addButton"]').click();
    cy.get('[data-testid="delete-icon"]').should('have.length', 2);

    cy.get('[data-testid="delete-icon"]').eq(1).click();
    cy.get('[data-testid="delete-icon"]').should('have.length', 0);
  });

  // ---------- Create page: Interactive Buttons -> WhatsApp Form ----------

  it('should show the WhatsApp Form fields', () => {
    openCreatePage();

    cy.contains('button', 'WhatsApp Form').click();
    cy.contains('Select Form*');
    cy.contains('Screen Name*');
    cy.contains('Button Title*');
    cy.get('input[placeholder="e.g., Fill Form"]').type('Continue');
    cy.get('input[placeholder="e.g., Fill Form"]').should('have.value', 'Continue');
  });

  // ---------- Create page: Media Attachment ----------

  it('should show attached image with the sample message as caption', () => {
    openCreatePage();

    cy.contains('button', 'Image').click();
    cy.get('input[name="attachmentURL"]').click().type(imageURL);

    cy.get('[data-testid="editor-body"]').click().type(sampleMessage).blur({ force: true });
    cy.get('[data-testid="beneficiaryName"]').click();
    cy.get('html').click();

    cy.get('[data-testid=imageMessage] > img', { timeout: 10000 }).should(
      'have.attr',
      'src',
      imageURL
    );
    cy.get('[data-testid="simulatedMessages"] > div > div').should('contain', sampleMessage);
  });

  it('should show attached document with the sample message as caption', () => {
    openCreatePage();

    cy.contains('button', 'Document').click();
    cy.get('input[name="attachmentURL"]').click().type(documentURL);

    cy.get('[data-testid="editor-body"]').click().type(sampleMessage).blur({ force: true });
    cy.get('[data-testid="beneficiaryName"]').click();
    cy.get('html').click();

    cy.get('[data-testid=documentMessage] > a', { timeout: 10000 }).should(
      'have.attr',
      'href',
      documentURL
    );
    cy.get('[data-testid="simulatedMessages"] > div > div').should('contain', sampleMessage);
  });

  it('should show attached video with the sample message as caption', () => {
    openCreatePage();

    cy.contains('button', 'Video').click();
    cy.get('input[name="attachmentURL"]').click().type(videoURL);

    cy.get('[data-testid="editor-body"]')
      .click()
      .type(sampleMessage, { delay: 80 })
      .blur({ force: true });
    cy.get('[data-testid="beneficiaryName"]').click();
    cy.get('html').click();

    cy.get('[data-testid=videoMessage] video', { timeout: 10000 }).should(
      'have.attr',
      'src',
      videoURL
    );
    cy.get('[data-testid="simulatedMessages"] > div > div').should('contain', sampleMessage);
  });

  it('should offer both Provide URL and Upload File options for an attachment type', () => {
    openCreatePage();

    cy.contains('button', 'Document').click();
    cy.contains('How would you like to provide the attachment?');
    cy.contains('button', 'Provide URL').should('be.visible');
    cy.contains('button', 'Upload File').should('be.visible');
  });

  it('should show a warning when uploading a file without Google Cloud Storage enabled', () => {
    openCreatePage();

    cy.contains('button', 'Image').click();
    cy.contains('button', 'Upload File').click();
    cy.contains(
      'File upload is not available for your organization. Please use "Provide URL" instead, or ask your admin to enable Google Cloud Storage.'
    );
    cy.contains('Click to upload or drag and drop').should('not.exist');
  });

  it('should clear the attachment type selection', () => {
    openCreatePage();

    cy.contains('button', 'Image').click();
    cy.contains('Clear attachment selection').should('be.visible');

    cy.contains('Clear attachment selection').click();
    cy.contains('Clear attachment selection').should('not.exist');
    cy.get('input[name="attachmentURL"]').should('not.exist');
  });

  it('should switch attachment type from Image to Document', () => {
    openCreatePage();

    cy.contains('button', 'Image').click();
    cy.get('input[name="attachmentURL"]').click().type(imageURL);

    cy.contains('button', 'Document').click();
    cy.get('input[name="attachmentURL"]').should('have.value', '');
  });

  // ---------- Create page: Organization & Tags ----------

  it('should create a new tag', () => {
    openCreatePage();

    const newTag = 'cy_tag_' + Date.now();
    cy.get('[data-testid="AutocompleteInput"] input').eq(1).click().type(newTag);
    cy.contains(`Create "${newTag}"`).click({ force: true });
    cy.get('[data-testid="AutocompleteInput"] input').eq(1).should('have.value', newTag);
  });

  // ---------- Create page: Form submission ----------

  it('should submit a text-only template with the correct payload', () => {
    const shortcode = 'cy_submit_text_' + Date.now();
    interceptCreateTemplate(shortcode);
    openCreatePage();

    cy.get('input[name="newShortcode"]').click().type(shortcode);
    cy.contains('button', 'Utility').click();
    cy.get('[data-testid="editor-body"]').click().type(sampleMessage).blur({ force: true });
    cy.get('[data-testid="beneficiaryName"]').click();
    cy.get('html').click();

    cy.get('[data-testid="submitActionButton"]').click();

    cy.wait('@createTemplate').then((interception) => {
      const input = interception.request.body.variables.input;
      expect(input.shortcode).to.eq(shortcode);
      expect(input.body).to.eq(sampleMessage);
      expect(input.example).to.eq(sampleMessage);
      expect(input.category).to.eq('UTILITY');
      expect(input.isHsm).to.eq(true);
      expect(input.type).to.eq('TEXT');
      expect(input.languageId).to.be.a('string');
      expect(input.languageId).to.have.length.greaterThan(0);
      expect(input.attachmentURL).to.eq(undefined);
      expect(input.hasButtons).to.eq(undefined);
    });
    cy.contains('HSM Template created successfully!');
  });

  it('should submit a template with a Quick Reply button and the correct payload', () => {
    const shortcode = 'cy_submit_qr_' + Date.now();
    interceptCreateTemplate(shortcode);
    openCreatePage();

    cy.get('input[name="newShortcode"]').click().type(shortcode);
    cy.contains('button', 'Utility').click();
    cy.get('[data-testid="editor-body"]').click().type(sampleMessage).blur({ force: true });

    cy.contains('button', 'Quick Reply').click();
    cy.get('input[placeholder="e.g., Yes, No, More Info"]').type('Yes');

    cy.get('[data-testid="beneficiaryName"]').click();
    cy.get('html').click();

    cy.get('[data-testid="submitActionButton"]').click();

    cy.wait('@createTemplate').then((interception) => {
      const input = interception.request.body.variables.input;
      expect(input.shortcode).to.eq(shortcode);
      expect(input.category).to.eq('UTILITY');
      expect(input.isHsm).to.eq(true);
      expect(input.hasButtons).to.eq(true);
      expect(input.buttonType).to.eq('QUICK_REPLY');
      expect(JSON.parse(input.buttons)).to.deep.eq([{ type: 'QUICK_REPLY', text: 'Yes' }]);
    });
    cy.contains('HSM Template created successfully!');
  });

  // ---------- Create page: Navigation ----------

  it('should navigate back to the list on clicking cancel', () => {
    openCreatePage();
    cy.get('[data-testid="cancelActionButton"]').click();
    cy.location('pathname').should('eq', '/template-v2');
  });

  it('should navigate back to the list on clicking the back icon', () => {
    openCreatePage();
    cy.get('[data-testid="back-button"]').click();
    cy.location('pathname').should('eq', '/template-v2');
  });
});
