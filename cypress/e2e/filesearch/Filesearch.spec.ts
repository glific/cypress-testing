describe('File search', () => {
  const assistantName = `Test Assistant ${+new Date()}`;

  beforeEach(function () {
    cy.login();

    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'Assistants') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              assistants: [
                {
                  id: '1',
                  insertedAt: '2024-10-16T15:58:26Z',
                  assistantId: 'asst_mock1',
                  name: assistantName,
                  status: 'ready',
                  newVersionInProgress: false,
                  temperature: 1,
                  vectorStore: {
                    __typename: 'VectorStore',
                    id: '1',
                    vectorStoreId: 'vs_mock1',
                    name: `VectorStore-${assistantName}`,
                    files: [],
                  },
                },
              ],
            },
          },
        });
      }
    }).as('getAssistants');

    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'ListOpenaiModels') {
        req.reply({
          statusCode: 200,
          body: { data: { listOpenaiModels: ['gpt-3.5-turbo', 'gpt-4-turbo', 'gpt-4o'] } },
        });
      }
    }).as('listOpenaiModels');

    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'Assistant') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              assistant: {
                __typename: 'AssistantResult',
                assistant: {
                  assistantId: 'asst_mock1',
                  id: req.body.variables.id,
                  insertedAt: '2024-10-15T11:29:28Z',
                  instructions: null,
                  model: 'gpt-3.5-turbo',
                  name: assistantName,
                  temperature: 1,
                  status: 'ready',
                  newVersionInProgress: false,
                  updatedAt: '2024-10-16T15:39:47Z',
                  vectorStore: {
                    __typename: 'VectorStore',
                    files: [],
                    id: req.body.variables.id,
                    legacy: false,
                    name: `VectorStore-${assistantName}`,
                    vectorStoreId: 'vs_mock1',
                    size: '0 B',
                  },
                },
              },
            },
          },
        });
      }
    }).as('getAssistant');

    cy.intercept('POST', '**/api', (req) => {
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              uploadFilesearchFile: {
                fileId: 'file-mock123',
                filename: 'sample.md',
                uploadedAt: '2024-10-16T15:58:26',
              },
            },
          },
        });
      }
    }).as('uploadFilesearchFile');

    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'CreateKnowledgeBase') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createKnowledgeBase: {
                knowledgeBase: {
                  id: 'kb-mock123',
                  name: `VectorStore-${assistantName}`,
                },
              },
            },
          },
        });
      }
    }).as('createKnowledgeBase');

    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'CreateAssistant') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createAssistant: {
                assistant: { id: '1', name: assistantName },
                errors: null,
              },
            },
          },
        });
      }
    }).as('createAssistant');

    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'UpdateAssistant') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              updateAssistant: {
                assistant: { id: '1', name: req.body.variables.input?.name },
                errors: null,
              },
            },
          },
        });
      }
    }).as('updateAssistant');

    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'DeleteAssistant') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              deleteAssistant: {
                assistant: { assistantId: 'asst_mock1', name: `${assistantName} updated` },
                errors: null,
              },
            },
          },
        });
      }
    }).as('deleteAssistant');

    cy.visit('/assistants');
    cy.wait('@getAssistants');
  });

  it('should load file search page', () => {
    cy.get('[data-testid="headerTitle"]').should('contain', 'Assistants');
  });

  it('should create a new assistant', () => {
    cy.get('[data-testid="headingButton"]').click();
    cy.get('input[name=name]').first().type(assistantName);
    cy.get('textarea[name=instructions]').first().type('This assistant is for searching files.\n');
    cy.get('[data-testid=autocomplete-element]')
      .type('gpt-3.5-turbo' + '{enter}')
      .type('{downArrow}')
      .type('{enter}')
      .wait(500);

    cy.get('[data-testid="addFiles"]').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.md', { force: true });
    cy.get('[data-testid="fileItem"]').should('contain', 'sample.md');
    cy.get('[data-testid="ok-button"]').should('not.be.disabled').click();
    cy.wait('@createKnowledgeBase');

    cy.get('[data-testid="submitAction"]').click();
    cy.wait('@createAssistant');

    cy.get('div').should('contain', 'Assistant created successfully');
  });

  it('changes the configuration for an assistant', () => {
    cy.get('input[name=searchInput]').type(`${assistantName}` + '{enter}');

    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');

    cy.get('input[name=name]').first().type(' updated');
    cy.get('textarea[name=instructions]').first().type('This is an instruction.\n');

    cy.get('[data-testid="expandIcon"]').click();
    cy.get('textarea[name=expand-instructions]').first().type('This is another instruction.');
    cy.get('[data-testid="save-button"]').click();

    cy.get('[data-testid="addFiles"]').click();
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.md', { force: true });
    cy.get('[data-testid="fileItem"]').should('contain', 'sample.md');
    cy.get('[data-testid="ok-button"]').should('not.be.disabled').click();
    cy.wait('@createKnowledgeBase');
    cy.get('div').should(
      'contain',
      "Knowledge base creation in progress, will notify once it's done"
    );

    cy.get('[data-testid="submitAction"]').click();
    cy.wait('@updateAssistant');
    cy.get('div').should('contain', 'Changes saved successfully');
  });

  it('should remove files and delete the assistant', () => {
    const updatedAssistantName = `${assistantName} updated`;
    cy.get('input[name=searchInput]').type(updatedAssistantName + '{enter}');

    cy.get('[data-testid="listItem"]').first().click();
    cy.wait('@getAssistant');

    cy.get('[data-testid="removeAssistant"]').first().click();

    cy.get('[data-testid="ok-button"]').click();
    cy.wait('@deleteAssistant');
    cy.get('div').should('contain', `Assistant ${updatedAssistantName} deleted successfully`);
  });
});
