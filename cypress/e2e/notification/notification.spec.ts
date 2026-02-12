describe('Notification list ', () => {
  beforeEach(function () {
    cy.intercept('POST', '**/api', (req) => {
      const { operationName } = req.body;

      if (operationName === 'notifications') {
        req.reply({
          data: {
            notifications: [
              {
                id: '1',
                category: 'Contact Upload',
                entity: '{"user_job_id":1}',
                message: 'Contact upload completed',
                severity: '"Information"',
                updatedAt: '2024-03-23T15:26:41Z',
                isRead: false,
              },
              {
                id: '2',
                category: 'Message',
                entity:
                  '{"id":1,"name":"Emily Davis","phone":"919876543210","status":"valid","last_message_at":"2024-03-23T14:00:00Z","is_hsm":null,"group_id":null,"flow_id":1,"bsp_status":"hsm"}',
                message:
                  'Sorry! 24 hrs window closed. Your message cannot be sent at this time.',
                severity: '"Warning"',
                updatedAt: '2024-03-23T14:26:41Z',
                isRead: false,
              },
              {
                id: '3',
                category: 'Partner',
                entity: '{"shortcode":"bigquery","id":2}',
                message:
                  'Disabling bigquery. Account does not have sufficient permissions.',
                severity: '"Critical"',
                updatedAt: '2024-03-23T13:26:41Z',
                isRead: true,
              },
            ],
          },
        });
      } else if (operationName === 'countNotifications') {
        req.reply({ data: { countNotifications: 3 } });
      } else if (operationName === 'markNotificationAsRead') {
        req.reply({ data: { markNotificationAsRead: true } });
      } else if (operationName === 'GetContactUploadReport') {
        req.reply({
          data: {
            getContactUploadReport: {
              csvRows: 'phone,name,status\n919876543210,Test,valid',
              error: null,
            },
          },
        });
      }
    });

    cy.login();
    cy.visit('/notifications');
  });

  it('should show Notifications in sidebar', () => {
    cy.get('[data-testid=list]').should('contain', 'Notifications');
  });

  it('should load notification list', () => {
    cy.get('[data-testid="listHeader"]').should('contain', 'Notifications');
    cy.get('[data-testid="tableBody"]').should('not.be.empty');
  });

  it('should show copy text and view menu after clicking entity ', () => {
    //   check if notifications are there
    cy.get('[data-testid="tableBody"]')
      .should('not.be.empty')
      .then(function () {
        cy.get('[data-testid="tableBody"] > tr > td > [data-testid=Menu]:first > div').click({
          force: true,
        });
        cy.get('[data-testid=MenuItem]').should('contain', 'Copy text');
        cy.get('[data-testid=MenuItem]').should('contain', 'View');
        cy.get('[data-testid="tableBody"] > tr > td > [data-testid=Menu]:first').click({
          force: true,
        });
        cy.get('[data-testid=MenuItem]').should('contain', 'Copy text');
        cy.get('[data-testid=MenuItem]').should('contain', 'View').last().click({ force: true });
        cy.contains('Done').click();
      });
  });

  it('downloads csv report for contact import', () => {
    cy.visit('/notifications');
    cy.get('[data-testid="additionalButton"]').first().click();
    cy.get('div').should('contain', 'Downloaded the status of the contact upload');
  });

  it('arrow should redirect to the particular page ', () => {
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    // select Warning filter as well to get all notifications
    cy.get('input[value=Warning]').click();
    cy.get('[data-testid="tableBody"]')
      .should('not.be.empty')
      .then(function () {
        cy.get('[data-testid=table]').contains('td', 'Message').next().next().next().next().click();
      });

    cy.get('@windowOpen').should('have.been.calledOnce');
    cy.get('@windowOpen').its('args.0.0').should('include', '/chat/1');
  });
});
