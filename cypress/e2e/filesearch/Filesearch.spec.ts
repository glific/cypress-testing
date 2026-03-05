describe('File search', () => {
  const assistantName = `Test Assistant ${+new Date()}`;
  const updatedName = `${assistantName} Updated`;

  // Mutable state for sequential CRUD tests
  let currentAssistantName = assistantName;
  let assistantDeleted = false;

  beforeEach(function () {
    cy.login();

    // Mock API response for listing assistants
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'Assistants') {
        const nameFilter = req.body.variables?.filter?.name || '';
        const allAssistants = assistantDeleted
          ? [
              {
                __typename: 'Assistant',
                id: '2',
                insertedAt: '2025-01-15T15:58:26Z',
                itemId: 'asst_existing_002',
                name: 'Sales Assistant',
              },
            ]
          : [
              {
                __typename: 'Assistant',
                id: '1',
                insertedAt: '2025-01-16T15:58:26Z',
                itemId: 'asst_test_001',
                name: currentAssistantName,
              },
              {
                __typename: 'Assistant',
                id: '2',
                insertedAt: '2025-01-15T15:58:26Z',
                itemId: 'asst_existing_002',
                name: 'Sales Assistant',
              },
              {
                __typename: 'Assistant',
                id: '3',
                insertedAt: '2025-01-14T15:58:26Z',
                itemId: 'asst_existing_003',
                name: 'Support Assistant',
              },
            ];

        const filtered = nameFilter
          ? allAssistants.filter((a) => a.name.toLowerCase().includes(nameFilter.toLowerCase()))
          : allAssistants;

        req.reply({
          statusCode: 200,
          body: { data: { assistants: filtered } },
        });
      }
    }).as('listAssistants');

    // Mock API response for getting a single assistant
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'Assistant') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              assistant: {
                __typename: 'AssistantResult',
                assistant: {
                  __typename: 'Assistant',
                  assistantId: 'asst_test_001',
                  id: req.body.variables.assistantId || '1',
                  newVersionInProgress: false,
                  name: currentAssistantName,
                  model: 'gpt-4o',
                  instructions: 'You are a helpful test assistant.',
                  status: 'active',
                  temperature: 1,
                  vectorStore: {
                    __typename: 'VectorStore',
                    id: 'vs-1',
                    vectorStoreId: 'vs-openai-1',
                    knowledgeBaseVersionId: 'kbv-1',
                    name: 'KnowledgeBase-Test',
                    legacy: false,
                    size: 1024,
                    files: [
                      {
                        __typename: 'File',
                        name: 'sample.md',
                        id: 'file-001',
                        fileSize: 1024,
                      },
                    ],
                  },
                },
              },
            },
          },
        });
      }
    }).as('getAssistant');

    // Mock API response for listing OpenAI models
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'RootQueryType') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              listOpenaiModels: ['gpt-4-turbo', 'chatgpt-4o-latest', 'gpt-4o'],
            },
          },
        });
      }
    }).as('listModels');

    // Mock API response for creating an assistant
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'CreateAssistant') {
        const inputName = req.body.variables?.input?.name || assistantName;
        currentAssistantName = inputName;
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createAssistant: {
                __typename: 'CreateAssistantPayload',
                assistant: {
                  __typename: 'Assistant',
                  id: '1',
                  name: inputName,
                },
              },
            },
          },
        });
      }
    }).as('createAssistant');

    // Mock API response for updating an assistant
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'UpdateAssistant') {
        const inputName = req.body.variables?.input?.name;
        if (inputName) currentAssistantName = inputName;
        req.reply({
          statusCode: 200,
          body: {
            data: {
              updateAssistant: {
                __typename: 'UpdateAssistantPayload',
                errors: null,
              },
            },
          },
        });
      }
    }).as('updateAssistant');

    // Mock API response for deleting an assistant
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'DeleteAssistant') {
        assistantDeleted = true;
        req.reply({
          statusCode: 200,
          body: {
            data: {
              deleteAssistant: {
                __typename: 'DeleteAssistantPayload',
                assistant: {
                  __typename: 'Assistant',
                  name: currentAssistantName,
                  assistantId: 'asst_test_001',
                },
                errors: null,
              },
            },
          },
        });
      }
    }).as('deleteAssistant');

    // Mock API response for uploading a file to Kaapi
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'UploadFilesearchFile') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              uploadFilesearchFile: {
                __typename: 'UploadFilesearchFilePayload',
                fileId: 'file-001',
                filename: 'sample.md',
                uploadedAt: '2025-01-16T15:58:26',
                fileSize: 1024,
              },
            },
          },
        });
      }
    }).as('uploadFile');

    // Mock API response for creating a knowledge base
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'CreateKnowledgeBase') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createKnowledgeBase: {
                __typename: 'CreateKnowledgeBasePayload',
                knowledgeBase: {
                  __typename: 'KnowledgeBase',
                  id: 'kb-1',
                  knowledgeBaseVersionId: 'kbv-1',
                  name: 'KnowledgeBase-Test',
                },
              },
            },
          },
        });
      }
    }).as('createKnowledgeBase');

    cy.visit('/assistants');
    cy.wait('@listAssistants');
    cy.get('[data-testid="headerTitle"]', { timeout: 10000 }).should('contain', 'Assistants');
  });

  it('should load file search page', () => {
    cy.get('[data-testid="headerTitle"]').should('contain', 'Assistants');
  });

  it('should display the header subtitle text', () => {
    cy.contains("Purpose-built AI that uses OpenAI's models and calls tools").should('be.visible');
  });

  it('should display the Create Assistant button', () => {
    cy.get('[data-testid="headingButton"]').should('be.visible').and('contain', 'Create Assistant');
  });

  it('should show placeholder text when no assistant is selected', () => {
    cy.contains('Please select or create an assistant.').should('be.visible');
  });

  it('should open the create form with all fields when clicking Create button', () => {
    cy.get('[data-testid="headingButton"]').click();
    cy.get('[data-testid="createAssistantContainer"]').should('be.visible');
    cy.contains('Name*').should('be.visible');
    cy.contains('Model*').should('be.visible');
    cy.contains('Instructions (Prompt)*').should('be.visible');
    cy.contains('Knowledge Base Files *').should('be.visible');
    cy.contains('Temperature').should('be.visible');
    cy.contains('Version Description').scrollIntoView().should('be.visible');
  });

  it('should display form helper texts in create mode', () => {
    cy.get('[data-testid="headingButton"]').click();
    cy.contains('Give a recognizable name for your assistant').should('exist');
    cy.contains('Choose the best model for your needs.').should('exist');
    cy.contains('Set the instructions according to your requirements.')
      .scrollIntoView()
      .should('be.visible');
    cy.contains('Briefly describe what changed in this version (optional)')
      .scrollIntoView()
      .should('be.visible');
  });

  it('should create a new assistant with file upload', () => {
    cy.get('[data-testid="headingButton"]').click();
    cy.wait(500);

    cy.get('input[name="name"]').type(assistantName);
    cy.get('[data-testid="AutocompleteInput"]').first().find('input').click();
    cy.get('.MuiAutocomplete-option').first().click();

    cy.get('textarea[name="instructions"]')
      .first()
      .type('You are a helpful test assistant for automated e2e testing.');

    cy.get('[data-testid="addFiles"]').click();
    cy.get('[data-testid="dialogTitle"]').should('contain', 'Manage Files');
    cy.get('[data-testid="uploadFile"]').selectFile('cypress/fixtures/sample.md', {
      force: true,
    });
    cy.wait('@uploadFile');
    cy.get('[data-testid="fileItem"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="ok-button"]').click();
    cy.wait('@createKnowledgeBase');

    cy.get('[data-testid="submitAction"]').click();
    cy.wait('@createAssistant');
    cy.contains('Assistant created successfully', { timeout: 10000 }).should('be.visible');
  });

  it('should display assistants in the list', () => {
    cy.get('[data-testid="listItem"]').should('have.length.greaterThan', 0);
  });

  it('should search for the created assistant by name', () => {
    cy.get('input[placeholder="Search"]').type(assistantName);
    cy.wait('@listAssistants');
    cy.get('[data-testid="listItem"]').should('have.length.greaterThan', 0);
    cy.contains(assistantName).should('be.visible');
  });

  it('should show empty state for non-existent search term', () => {
    cy.get('input[placeholder="Search"]').type('NonExistentAssistant_XYZ_99999');
    cy.wait('@listAssistants');
    cy.contains('No assistants found!').should('be.visible');
  });

  it('should clear search and restore the full list', () => {
    cy.get('input[placeholder="Search"]').type('SomeSearchTerm');
    cy.wait(500);
    cy.get('[data-testid="CloseIcon"]').click();
    cy.wait('@listAssistants');
    cy.get('[data-testid="listItem"]').should('have.length.greaterThan', 0);
  });

  it('should copy assistant item ID from the list', () => {
    cy.get('[data-testid="listItem"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="copyItemId"]').first().click({ force: true });
  });

  it('should select an assistant and display its details in the form', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('[data-testid="createAssistantContainer"]').should('be.visible');
    cy.get('input[name="name"]').should('have.value', currentAssistantName);
  });

  it('should display knowledge base details for the selected assistant', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.contains(/\d+ files?/).should('be.visible');
  });

  it('should copy assistant ID from the edit form', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('[data-testid="copyCurrentAssistantId"]').click();
  });

  it('should show unsaved changes indicator when name is modified', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('input[name="name"]').type(' modified');
    cy.get('[data-testid="unsavedIndicator"]').should('be.visible');
    cy.contains('Unsaved changes').should('be.visible');
  });

  it('should show unsaved changes indicator when temperature is modified', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('input[name="sliderDisplay"]').clear().type('0.5');
    cy.get('[data-testid="unsavedIndicator"]').should('be.visible');
  });

  it('should update the assistant name and save', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');

    cy.get('input[name="name"]').clear().type(updatedName);

    cy.get('[data-testid="submitAction"]').click();
    cy.wait('@updateAssistant');
    cy.contains('Changes saved successfully', { timeout: 10000 }).should('be.visible');
  });

  it('should show error for temperature value above 2', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('input[name="sliderDisplay"]').clear().type('2.5');
    cy.contains('Temperature value should be between 0-2').should('be.visible');
  });

  it('should show error for negative temperature value', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('input[name="sliderDisplay"]').clear().type('-1');
    cy.contains('Temperature value should be between 0-2').should('be.visible');
  });

  it('should open instructions dialog and cancel without changes', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('[data-testid="expandIcon"]').click();
    cy.contains('Edit system instructions').should('be.visible');
    cy.get('[data-testid="cancel-button"]').click();
    cy.contains('Edit system instructions').should('not.exist');
  });

  it('should edit instructions in the expanded dialog and save', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('[data-testid="expandIcon"]').click();
    cy.get('textarea[name="expand-instructions"]')
      .clear()
      .type('Updated instructions from e2e test');
    cy.get('[data-testid="save-button"]').click();
    cy.get('textarea[name="instructions"]').should(
      'have.value',
      'Updated instructions from e2e test'
    );
  });

  it('should show existing files when opening file dialog for the assistant', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('[data-testid="addFiles"]').click();
    cy.get('[data-testid="fileItem"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="cancel-button"]').click();
  });

  it('should disable OK button when all files are removed from the dialog', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('[data-testid="addFiles"]').click();
    cy.get('[data-testid="fileItem"]').should('have.length.greaterThan', 0);

    cy.get('[data-testid="deleteFile"]').each(($btn) => {
      cy.wrap($btn).click();
    });

    cy.get('[data-testid="ok-button"]').should('be.disabled');
    cy.get('[data-testid="cancel-button"]').click();
  });

  it('should revert files when canceling the dialog after deleting files', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('[data-testid="addFiles"]').click();

    cy.get('[data-testid="fileItem"]')
      .its('length')
      .then((originalCount) => {
        cy.get('[data-testid="deleteFile"]').first().click();
        cy.get('[data-testid="cancel-button"]').click();

        // Reopen dialog - files should be restored
        cy.get('[data-testid="addFiles"]').click();
        cy.get('[data-testid="fileItem"]').should('have.length', originalCount);
        cy.get('[data-testid="cancel-button"]').click();
      });
  });

  it('should show delete confirmation dialog with warning text and allow canceling', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('[data-testid="removeAssistant"]').click();
    cy.contains('Are you sure you want to delete').should('be.visible');
    cy.contains(
      'Please confirm that this assistant is not being used in any of the active flows.'
    ).should('be.visible');
    cy.get('[data-testid="cancel-button"]').click();
  });

  it('should delete the assistant and show success notification', () => {
    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');
    cy.get('[data-testid="removeAssistant"]').click();
    cy.get('[data-testid="ok-button"]').click();
    cy.wait('@deleteAssistant');
    cy.contains('deleted successfully', { timeout: 10000 }).should('be.visible');
  });

  it('should show empty search after assistant is deleted', () => {
    cy.get('input[placeholder="Search"]').type(updatedName);
    cy.wait('@listAssistants');
    cy.contains('No assistants found!').should('be.visible');
  });
});
