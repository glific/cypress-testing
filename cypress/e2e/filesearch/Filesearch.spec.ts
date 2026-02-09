describe('File search', () => {
  beforeEach(function () {
    cy.login();

    // Mock API response for listing assistants
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
                  itemId: 'asst_UaWOAyI61Njf9l77Ey9iv0VI',
                  name: 'Assistant-1',
                },
                {
                  id: '2',
                  insertedAt: '2024-10-16T15:58:26Z',
                  itemId: 'asst_UaWOAyI61Njf9l77Ey9iv0VJ',
                  name: 'Assistant-2',
                },
                {
                  id: '3',
                  insertedAt: '2024-10-16T15:58:26Z',
                  itemId: 'asst_UaWOAyI61Njf9l77Ey9iv0VK',
                  name: 'Assistant-3',
                },
              ],
            },
          },
        });
      }
    }).as('getAssistants');

    // Mock API response for listing OpenAI models
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'ListOpenaiModels') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              listOpenaiModels: [
                'gpt-4-turbo',
                'gpt-4-turbo-2024-04-09',
                'chatgpt-4o-latest',
                'gpt-4o',
              ],
            },
          },
        });
      }
    }).as('listOpenaiModels');

    // Mock API response for creating an assistant
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'CreateAssistant') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              createAssistant: {
                assistant: {
                  id: 4,
                  name: 'Assistant-405db438',
                },
              },
            },
          },
        });
      }
    }).as('createAssistant');

    // Mock API response for getting a single assistant
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'GetAssistant') {
        const assistantId = req.body.variables.assistantId;
        req.reply({
          statusCode: 200,
          body: {
            data: {
              assistant: {
                __typename: 'AssistantResult',
                assistant: {
                  assistantId: 'asst_JhYmNWzpCVBZY2vTuohvmqjs',
                  id: assistantId,
                  insertedAt: '2024-10-15T11:29:28Z',
                  instructions: null,
                  model: 'gpt-4o',
                  name: 'cc4d824d',
                  temperature: 1,

                  updatedAt: '2024-10-16T15:39:47Z',
                  vectorStore: {
                    __typename: 'VectorStore',
                    files: [],
                    id: assistantId,
                    legacy: false,
                    name: 'VectorStore-cc4d824d',
                    vectorStoreId: 'vs_9XoZtHjv1qLh8sKqj5nXG2gmy',
                },
              },
            },
          },
        });
      }
    }).as('getAssistant');

    // Mock API response for getting assistant files
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'GetAssistantFiles') {
        const assistantId = req.body.variables.assistantId;
        req.reply({
          statusCode: 200,
          body: {
            data: {
              assistant: {
                __typename: 'AssistantResult',
                assistant: {
                  __typename: 'Assistant',
                  vectorStore: {
                    __typename: 'VectorStore',
                    files: [
                      {
                        __typename: 'FileInfo',
                        fileId: 'file-rls90OGDUgFeLewh6e01Eamf',
                        filename: 'Accelerator Guide (1).pdf',
                      },
                    ],
                    id: assistantId,
                    legacy: false,
                    name: 'VectorStore-77ae3597',
                    vectorStoreId: 'vs_laIycGtun7qEl0U7zlVsygmy',
                  },
                },
              },
            },
          },
        });
      }
    }).as('getAssistantFiles');

    // Mock API response for uploading a file
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'UploadFilesearchFile') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              uploadFilesearchFile: {
                fileId: 'file-rls90OGDUgFeLewh6e01Eamf',
                filename: 'sample.md',
              },
            },
          },
        });
      }
    }).as('uploadFile');

    // Mock API response for adding files to file search
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'AddAssistantFiles') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              addAssistantFiles: {
                assistant: {
                  id: req.body.variables.addAssistantFilesId,
                },
                errors: null,
              },
            },
          },
        });
      }
    }).as('addAssistantFiles');

    // Mock API response for removing files from assistant
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'RemoveAssistantFile') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              removeAssistantFile: {
                assistant: {
                  id: req.body.variables.removeAssistantFileId,
                },
                errors: null,
              },
            },
          },
        });
      }
    }).as('removeAssistantFile');

    // Mock API response for updating an assistant
    cy.intercept('POST', '**/api', (req) => {
      if (req.body.operationName === 'UpdateAssistant') {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              updateAssistant: {
                assistant: {
                  id: req.body.variables.updateAssistantId,
                  name: req.body.variables.input.name,
                },
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
        req.reply({
          statusCode: 200,
          body: {
            data: {
              deleteAssistant: {
                assistant: {
                  assistantId: req.body.variables.deleteAssistantId,
                  name: 'test assistant',
                },
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
    cy.wait('@createAssistant');
    cy.get('div').should('contain', 'Assistant created successfully');
  });

  it('changes the configuration for an assistant', () => {
    cy.get('[data-testid="listItem"]').first().click();

    cy.wait('@getAssistant');

    cy.get('input[name=name]').first().type('{selectAll}');
    cy.get('input[name=name]').first().type('{backspace}');
    cy.get('input[name=name]').first().type('test assistant');
    cy.get('textarea[name=instructions]').first().type('This is an instruction.\n');

    cy.get('[data-testid="expandIcon"]').click();
    cy.get('textarea[name=expand-instructions]').first().type('This is another instruction.');
    cy.get('[data-testid="save-button"]').click();

    cy.get('[data-testid="addFiles"]').click();

    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.md', {
      force: true,
    });

    cy.get('div').should('contain', 'sample.md');

    cy.wait(500);

    cy.get('[data-testid="ok-button"]').click();
    cy.wait('@addAssistantFiles');
    cy.get('div').should('contain', 'Files added to assistant!');

    cy.get('[data-testid="submitAction"]').click();
    cy.wait('@updateAssistant');
    cy.get('div').should('contain', 'Changes saved successfully');
  });

  it('should remove files and delete the assistant', () => {
    cy.get('[data-testid="listItem"]').first().click();

    cy.wait('@getAssistant');

    cy.get('[data-testid="addFiles"]').click();
    cy.wait('@getAssistantFiles');
    cy.get('[data-testid="deleteFile"]').first().click();
    cy.wait('@removeAssistantFile');

    cy.get('[data-testid="ok-button"]').click();

    cy.get('[data-testid="removeAssistant"]').first().click();

    cy.get('[data-testid="ok-button"]').click();
    cy.wait('@deleteAssistant');
    cy.get('div').should('contain', 'Assistant test assistant deleted successfully');
  });
});
