// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- login command --
Cypress.Commands.add(
  'login',
  (phone = '91' + Cypress.env('phone'), password = Cypress.env('password')) => {
    return cy
      .request({
        method: 'POST',
        url: `${Cypress.env('backendUrl')}/v1/session`,
        body: {
          user: {
            phone: phone,
            password: password,
          },
        },
      })
      .then((response) => {
        const session = JSON.stringify(response.body.data);
        localStorage.setItem('glific_session', session);
        localStorage.setItem(
          'glific_user',
          JSON.stringify({
            organization: { id: '1' },
            roles: [{ id: '1', label: 'Glific_admin' }],
          })
        );
      });
  }
);

// --app login--
Cypress.Commands.add('appLogin', (phone, password) => {
  cy.visit('/login');
  cy.get('input[type=tel]').type(phone);
  cy.get('input[type=password]').type(password);
  cy.get('[data-testid="SubmitButton"]').click();
  cy.get('div').should('contain', 'Chats');
});

// -- add kaapi credentials--
Cypress.Commands.add('addKaapiCredentials', (organization_id) => {
  const api_key = Cypress.env('kaapi_api_key');
  const glific_bearer_token = JSON.parse(localStorage.getItem('glific_session')).access_token;

  const mutation = `
    mutation createProvider($input: CredentialInput!) {
      createCredential(input: $input) {
        credential {
          id
          provider {
            shortcode
          }
          keys
          secrets
          isActive
        }
        errors {
          key
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      shortcode: 'kaapi',
      keys: JSON.stringify({}),
      secrets: JSON.stringify({ api_key: api_key }),
      isActive: true,
    },
  };

  cy.request({
    method: 'POST',
    url: `${Cypress.env('backendUrl')}`,
    headers: {
      authorization: glific_bearer_token,
    },
    body: {
      query: mutation,
      variables,
    },
  }).then((response) => {
    // Ignore errors when token is already present
    const providerTakenError =
      response.body &&
      response.body.data &&
      response.body.data.createCredential &&
      Array.isArray(response.body.data.createCredential.errors) &&
      response.body.data.createCredential.errors.some(
        (err) =>
          err.key === 'provider_id' &&
          typeof err.message === 'string' &&
          err.message.includes('has already been taken')
      );

    if (!providerTakenError) {
      // Only assert on success or other errors, not for provider taken
      expect(response.status).to.eq(200);
      expect(response.body.errors).to.eq(null);
    }
  });
});