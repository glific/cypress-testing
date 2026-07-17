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

describe('HSM Template V2 - View & Add Language', () => {
  const familyShortcode = 'cy_hsm_family_' + Date.now();
  const anchorId = '910001';
  const hindiId = '910002';
  const pendingId = '910003';
  const failedId = '910004';
  const newVariantId = '910005';

  // This dev org only has English + Hindi active — real, fetched once below —
  // so the fixtures below deliberately reuse those two labels across extra
  // status/id slots instead of assuming a richer language catalog exists.
  let realLanguages: Array<{ id: string; label: string; locale: string }> = [];

  const langByLabel = (label: string) => {
    const found = realLanguages.find((language) => language.label === label);
    if (!found) {
      throw new Error(`Expected an active "${label}" language in this org's language list`);
    }
    return found;
  };

  before(() => {
    // Reuse cy.login() (same as every beforeEach in this file) rather than
    // re-POSTing to /v1/session ourselves — it already stores the session,
    // access_token included, under the glific_session localStorage key.
    cy.login();
    cy.window()
      .then((win) => JSON.parse(win.localStorage.getItem('glific_session') || '{}').access_token)
      .then((accessToken) => {
        cy.request({
          method: 'POST',
          url: Cypress.expose('backendUrl'),
          headers: { authorization: accessToken },
          body: {
            query: `query { currentUser { user { organization { activeLanguages { id label locale } } } } }`,
          },
        }).then((languagesResponse) => {
          realLanguages = languagesResponse.body.data.currentUser.user.organization.activeLanguages;
        });
      });
  });

  const baseVariant = (overrides: Record<string, any> = {}) => ({
    __typename: 'SessionTemplate',
    bspId: null,
    label: 'Cypress Welcome',
    body: 'Hi {{1}}, welcome!',
    footer: null,
    shortcode: familyShortcode,
    category: 'UTILITY',
    isReserved: false,
    status: 'APPROVED',
    reason: null,
    isHsm: true,
    isActive: true,
    updatedAt: '2024-01-15T10:00:00Z',
    numberParameters: 1,
    translations: null,
    type: 'TEXT',
    quality: 'HIGH',
    language: { __typename: 'Language', ...langByLabel('English') },
    tag: null,
    MessageMedia: null,
    ...overrides,
  });

  let family: Array<Record<string, any>> = [];

  // `mode: 'full'` builds all four status buckets (for the direct view page's
  // tab-grouping tests), reusing English/Hindi across the extra Pending/Failed
  // slots since this org only has those two languages active. `includeSibling:
  // false` leaves the anchor as the family's only member, so Hindi stays free
  // for the "add a language" tests to pick; `includeSibling: true` (default)
  // adds a Hindi sibling, for tests that need something to view/delete.
  const interceptFamily = (options: { mode?: 'full'; includeSibling?: boolean } = {}) => {
    const { mode, includeSibling = true } = options;
    const englishVariant = baseVariant({ id: anchorId });
    const hindiVariant = baseVariant({
      id: hindiId,
      body: 'Namaste {{1}}, swagat hai!',
      language: { __typename: 'Language', ...langByLabel('Hindi') },
    });
    if (mode === 'full') {
      const pendingVariant = baseVariant({
        id: pendingId,
        status: 'PENDING',
        body: 'Namaste {{1}}, swagat hai!',
        language: { __typename: 'Language', ...langByLabel('Hindi') },
      });
      const failedVariant = baseVariant({
        id: failedId,
        status: 'FAILED',
        body: 'Hi {{1}}, welcome!',
        language: { __typename: 'Language', ...langByLabel('English') },
      });
      family = [englishVariant, hindiVariant, pendingVariant, failedVariant];
    } else {
      family = includeSibling ? [englishVariant, hindiVariant] : [englishVariant];
    }

    cy.intercept('POST', '**/api', (req) => {
      const op = req.body.operationName;
      if (op === 'sessionTemplates') {
        req.alias = 'sessionTemplatesQuery';
        req.reply({ statusCode: 200, body: { data: { sessionTemplates: family } } });
      } else if (op === 'getsessionTemplate') {
        // Return the specific variant that was asked for (falling back to the
        // anchor) so the Apollo cache write for this id never clobbers another
        // entity's normalized record and re-triggers unrelated query watchers.
        const requestedId = req.body.variables?.id;
        const entity = family.find((variant) => variant.id === requestedId) || englishVariant;
        req.alias = 'getAnchorTemplate';
        req.reply({
          statusCode: 200,
          body: {
            data: {
              sessionTemplate: {
                __typename: 'SessionTemplateResult',
                sessionTemplate: {
                  ...entity,
                  example: entity.body,
                  hasButtons: false,
                  buttons: null,
                  buttonType: null,
                },
              },
            },
          },
        });
      } else if (op === 'deleteSessionTemplate') {
        const deletedId = req.body.variables?.id;
        family = family.filter((variant) => variant.id !== deletedId);
        req.alias = 'deleteVariant';
        req.reply({ statusCode: 200, body: { data: { deleteSessionTemplate: { errors: null } } } });
      } else if (op === 'createSessionTemplate') {
        const created = baseVariant({
          id: newVariantId,
          status: 'PENDING',
          language: { __typename: 'Language', ...langByLabel('Hindi') },
        });
        family = [...family, created];
        req.alias = 'createVariant';
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createSessionTemplate: {
                sessionTemplate: {
                  ...created,
                  example: created.body,
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

  const openAddLanguageFromList = (includeSibling = true) => {
    interceptFamily({ includeSibling });
    cy.visit('/template-v2');
    cy.wait('@sessionTemplatesQuery');
    cy.get('[data-testid="add-language-icon"]').click();
    cy.location('pathname').should('eq', '/template-v2/add');
    cy.wait('@getAnchorTemplate');
    cy.wait('@sessionTemplatesQuery');
  };

  beforeEach(function () {
    cy.login();
  });

  // ---------- Viewing an existing template directly (/template-v2/:id/edit) ----------

  describe('direct view page', () => {
    beforeEach(() => {
      interceptFamily({ mode: 'full' });
      cy.visit(`/template-v2/${anchorId}/edit`);
      cy.wait('@getAnchorTemplate');
      cy.wait('@sessionTemplatesQuery');
    });

    it('should show the template as read-only with no submit button', () => {
      cy.get('[data-testid="headerTitle"]').should('contain', familyShortcode);
      cy.get('input[name="newShortcode"]').should('be.disabled');
      cy.get('[data-testid="submitActionButton"]').should('not.exist');
      cy.get('[data-testid="cancelActionButton"]').should('contain', 'Go Back');
    });

    it('should group language versions by status with the correct counts', () => {
      cy.get('[data-testid="status-tab-Approved"]').should('contain', '2');
      cy.get('[data-testid="status-tab-In Progress"]').should('contain', '1');
      cy.get('[data-testid="status-tab-Rejected"]').should('contain', '1');
      cy.get('[data-testid="language-version-row"]').should('have.length', 2);
    });

    it('should switch to the In Progress tab and show the pending variant', () => {
      cy.get('[data-testid="status-tab-In Progress"]').click();
      cy.get('[data-testid="language-version-row"]')
        .should('have.length', 1)
        .and('contain', 'Hindi');
    });

    it('should switch to the Rejected tab and show the failed variant', () => {
      cy.get('[data-testid="status-tab-Rejected"]').click();
      cy.get('[data-testid="language-version-row"]')
        .should('have.length', 1)
        .and('contain', 'English');
    });

    it('should not show Add Language or Delete controls when opened via the direct link', () => {
      cy.get('[data-testid="add-language-link"]').should('not.exist');
      cy.get(`[data-testid="delete-language-${hindiId}"]`).should('not.exist');
    });

    it('should navigate to a sibling variant page when its View link is clicked', () => {
      cy.get(`[data-testid="view-language-${hindiId}"]`).click();
      cy.location('pathname').should('eq', `/template-v2/${hindiId}/edit`);
    });

    it('should navigate back to the list on clicking Go Back', () => {
      cy.get('[data-testid="cancelActionButton"]').click();
      cy.location('pathname').should('eq', '/template-v2');
    });
  });

  describe('add language flow', () => {
    it('should open the anchor in view mode with Add Language and Delete controls', () => {
      openAddLanguageFromList();
      cy.get('[data-testid="headerTitle"]').should('contain', familyShortcode);
      cy.get('[data-testid="add-language-link"]').should('be.visible');
      cy.get(`[data-testid="delete-language-${hindiId}"]`).should('be.visible');
    });

    it('should open a blank, editable form for the new language and hide already-used languages', () => {
      // Anchor-only family: English is already used (by the anchor), so it
      // must be hidden — Hindi, this org's only other active language, is
      // what's left to prove still shows up as selectable.
      openAddLanguageFromList(false);
      cy.get('[data-testid="add-language-link"]').click();

      cy.get('[data-testid="headerTitle"]').should('contain', 'Add Language');
      cy.get('input[name="newShortcode"]').should('have.value', familyShortcode).and('be.disabled');
      cy.get('[data-testid="submitActionButton"]').should('exist');

      cy.get('[data-testid="AutocompleteInput"] input').eq(0).click();
      cy.get('[role="listbox"]').should('contain', 'Hindi');
      cy.get('[role="listbox"]').should('not.contain', 'English');
    });

    it('should submit a new language version with the correct payload', () => {
      openAddLanguageFromList(false);
      cy.get('[data-testid="add-language-link"]').click();

      cy.get('[data-testid="AutocompleteInput"] input').eq(0).click().clear().type('Hindi');
      cy.contains('Hindi').click({ force: true });
      cy.get('[data-testid="editor-body"]').click().type('Namaste, welcome!').blur({ force: true });
      cy.get('[data-testid="beneficiaryName"]').click();
      cy.get('html').click();

      cy.get('[data-testid="submitActionButton"]').click();

      cy.wait('@createVariant').then((interception) => {
        const input = interception.request.body.variables.input;
        expect(input.shortcode).to.eq(familyShortcode);
        expect(input.languageId).to.eq(langByLabel('Hindi').id);
      });
      cy.contains('HSM Template created successfully!');

      cy.location('pathname').should('eq', '/template-v2');
    });

    it('should delete a non-anchor language version after confirmation', () => {
      openAddLanguageFromList();
      cy.get(`[data-testid="delete-language-${hindiId}"]`).click();

      cy.get('[data-testid="dialogTitle"]').should('contain', 'Hindi');
      cy.get('[data-testid="ok-button"]').click();

      cy.wait('@deleteVariant');
      cy.contains('Template deleted successfully');
      cy.get(`[data-testid="delete-language-${hindiId}"]`).should('not.exist');
      cy.get('[data-testid="status-tab-Approved"]').should('contain', '1');
    });
  });
});
