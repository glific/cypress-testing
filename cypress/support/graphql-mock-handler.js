// Global GraphQL mock handler
// Intercepts ALL GraphQL operations so tests don't need a real backend.
// Individual test files can still add their own cy.intercept() to override specific operations.

const mockResponses = {
  // ==================== ORGANIZATION ====================
  organization: {
    data: {
      organization: {
        organization: {
          id: '1',
          name: 'Test Organization',
          contact: { phone: '917834811114' },
          outOfOffice: {
            defaultFlowId: null,
            enabled: false,
            enabledDays: [
              { id: 1, enabled: true },
              { id: 2, enabled: true },
              { id: 3, enabled: true },
              { id: 4, enabled: true },
              { id: 5, enabled: true },
              { id: 6, enabled: false },
              { id: 7, enabled: false },
            ],
            startTime: '09:00:00',
            endTime: '20:00:00',
            flowId: null,
          },
          defaultLanguage: { id: '1', label: 'English' },
          activeLanguages: [
            { id: '1', label: 'English' },
            { id: '2', label: 'Hindi' },
          ],
          setting: {
            lowBalanceThreshold: '10',
            criticalBalanceThreshold: '5',
            sendWarningMail: false,
            allowBotNumberUpdate: false,
          },
          regxFlow: null,
          signaturePhrase: null,
          newcontactFlowId: null,
          optinFlowId: null,
          status: 'ACTIVE',
          isSuspended: false,
          trialExpirationDate: null,
          isTrialOrg: false,
          bsp: { shortcode: 'gupshup' },
        },
      },
    },
  },

  bspbalance: {
    data: { bspbalance: '{"balance":10.00}' },
  },

  organizationServices: {
    data: {
      organizationServices: {
        dialogflow: false,
        autoTranslationEnabled: false,
        googleCloudStorage: false,
        flowUuidDisplay: false,
        rolesAndPermission: true,
        contactProfileEnabled: false,
        ticketingEnabled: false,
        whatsappGroupEnabled: true,
        certificateEnabled: false,
        askMeBotEnabled: false,
        whatsappFormsEnabled: true,
      },
    },
  },

  provider: {
    data: {
      organization: {
        organization: { bsp: { shortcode: 'gupshup' } },
      },
    },
  },

  organizationPhone: {
    data: {
      organization: {
        organization: { contact: { phone: '917834811114' } },
      },
    },
  },

  QualityRating: {
    data: { qualityRating: { currentLimit: 'TIER_10K' } },
  },

  organizationState: {
    data: {
      organization: {
        organization: {
          isSuspended: false,
          trialExpirationDate: null,
          isTrialOrg: false,
        },
      },
    },
  },

  currentUserOrganisationLanguages: {
    data: {
      currentUser: {
        user: {
          organization: {
            activeLanguages: [
              { id: '1', label: 'English', localized: true, locale: 'en' },
              { id: '2', label: 'Hindi', localized: true, locale: 'hi' },
            ],
            defaultLanguage: { id: '1', label: 'English' },
          },
        },
      },
    },
  },

  providers: {
    data: { providers: [] },
  },

  credential: {
    data: {
      credential: {
        credential: {
          id: '1',
          isActive: true,
          keys: '{}',
          secrets: '{}',
          provider: { shortcode: 'gupshup' },
        },
      },
    },
  },

  countOrganizations: {
    data: { countOrganizations: 1 },
  },

  organizations: {
    data: { organizations: [] },
  },

  // ==================== USER ====================
  currentUser: {
    data: {
      currentUser: {
        user: {
          id: '1',
          name: 'Test Admin',
          phone: '917834811114',
          email: 'admin@test.com',
          accessRoles: [{ id: '1', label: 'Admin' }],
          contact: { id: '1', name: 'Test Admin', phone: '917834811114' },
          groups: [],
          organization: { id: '1', contact: { phone: '917834811114' } },
          language: { id: '1', locale: 'en' },
        },
      },
    },
  },

  countUsers: {
    data: { countUsers: 2 },
  },

  users: {
    data: {
      users: [
        {
          id: '1',
          name: 'Test Admin',
          phone: '917834811114',
          accessRoles: [{ label: 'Admin' }],
          groups: [],
          contact: { id: '1' },
        },
        {
          id: '2',
          name: 'Test Staff',
          phone: '919820112345',
          accessRoles: [{ label: 'Staff' }],
          groups: [],
          contact: { id: '2' },
        },
      ],
    },
  },

  user: {
    data: {
      user: {
        user: {
          id: '1',
          name: 'Test Admin',
          phone: '917834811114',
          isRestricted: false,
          accessRoles: [{ id: '1', label: 'Admin' }],
          groups: [],
        },
      },
    },
  },

  GET_USER_CONTACT_IDS: {
    data: { users: [{ contact: { id: '1' } }] },
  },

  deleteUser: {
    data: { deleteUser: { errors: null } },
  },

  updateUser: {
    data: {
      updateUser: {
        user: { id: '1', name: 'Test Admin', phone: '917834811114' },
        errors: null,
      },
    },
  },

  updateCurrentUser: {
    data: { updateCurrentUser: { user: { id: '1' }, errors: null } },
  },

  // ==================== SEARCH / CHAT ====================
  search: {
    data: {
      search: [
        {
          id: 'contact_2',
          contact: {
            id: '2',
            name: 'Simulator',
            phone: '9876543210',
            fields: '{}',
            maskedPhone: '****3210',
            lastMessageAt: new Date().toISOString(),
            status: 'VALID',
            bspStatus: 'SESSION_AND_HSM',
            isOrgRead: true,
          },
          group: null,
          messages: [
            {
              id: '1',
              body: 'Hi',
              insertedAt: new Date().toISOString(),
              messageNumber: 1,
              receiver: { id: '1' },
              sender: { id: '2' },
              location: null,
              type: 'TEXT',
              media: null,
              errors: null,
              contextMessage: null,
              interactiveContent: '{}',
              sendBy: '',
              flowLabel: null,
              whatsappFormResponse: null,
            },
          ],
        },
      ],
    },
  },

  searchMulti: {
    data: {
      searchMulti: {
        contacts: [],
        messages: [],
        labels: [],
      },
    },
  },

  savedSearches: {
    data: {
      savedSearches: [
        { id: '1', shortcode: 'all', label: 'All', isReserved: true, args: '{}' },
        { id: '2', shortcode: 'unread', label: 'Unread', isReserved: true, args: '{}' },
        { id: '3', shortcode: 'optout', label: 'Optout', isReserved: true, args: '{}' },
      ],
    },
  },

  countSavedSearches: {
    data: { countSavedSearches: 3 },
  },

  savedSearch: {
    data: {
      savedSearch: {
        savedSearch: {
          id: '1',
          shortcode: 'all',
          label: 'All',
          args: '{}',
        },
      },
    },
  },

  count: {
    data: { collectionStats: '{}' },
  },

  createSavedSearch: {
    data: {
      createSavedSearch: {
        savedSearch: { id: '4', label: 'New Search', args: '{}' },
        errors: null,
      },
    },
  },

  updateSavedSearch: {
    data: {
      updateSavedSearch: {
        savedSearch: { id: '1' },
        errors: null,
      },
    },
  },

  deleteSavedSearch: {
    data: { deleteSavedSearch: { errors: null } },
  },

  // ==================== CONTACTS ====================
  contacts: {
    data: {
      contacts: [
        {
          id: '2',
          name: 'Simulator',
          phone: '9876543210',
          maskedPhone: '****3210',
          groups: [],
          status: 'VALID',
          optinTime: null,
          optoutTime: null,
          optinMethod: null,
          optoutMethod: null,
          fields: '{}',
        },
      ],
    },
  },

  countContacts: {
    data: { countContacts: 1 },
  },

  contact: {
    data: {
      contact: {
        contact: {
          id: '2',
          name: 'Simulator',
          phone: '9876543210',
          language: { id: '1', label: 'English' },
          groups: [],
          status: 'VALID',
          bspStatus: 'SESSION_AND_HSM',
          settings: null,
          fields: '{}',
          activeProfile: null,
          maskedPhone: '****3210',
          lastMessageAt: new Date().toISOString(),
          optinTime: null,
          optoutTime: null,
          optinMethod: null,
          optoutMethod: null,
        },
      },
    },
  },

  getContact: {
    data: {
      contact: {
        contact: {
          id: '2',
          name: 'Simulator',
          phone: '9876543210',
          language: { id: '1', label: 'English' },
          groups: [],
          status: 'VALID',
          bspStatus: 'SESSION_AND_HSM',
          settings: null,
          fields: '{}',
          activeProfile: null,
          maskedPhone: '****3210',
          lastMessageAt: new Date().toISOString(),
          optinTime: null,
          optoutTime: null,
          optinMethod: null,
          optoutMethod: null,
        },
      },
    },
  },

  deleteContact: {
    data: { deleteContact: { errors: null } },
  },

  updateContact: {
    data: {
      updateContact: { contact: { id: '2' }, errors: null },
    },
  },

  createContact: {
    data: {
      createContact: {
        contact: { id: '3', name: 'New Contact', phone: '9999999999' },
        errors: null,
      },
    },
  },

  MoveContacts: {
    data: { moveContacts: { csv_rows: '0', errors: null } },
  },

  ImportContacts: {
    data: { importContacts: { status: 'success', errors: null } },
  },

  GetContactUploadReport: {
    data: { getContactUploadReport: null },
  },

  ContactHistory: {
    data: { contactHistory: [] },
  },

  CountContactHistory: {
    data: { countContactHistory: 0 },
  },

  Profiles: {
    data: { profiles: [] },
  },

  getProfile: {
    data: {
      profile: {
        profile: {
          id: '1',
          name: 'Default',
          fields: '{}',
          type: 'default',
          language: { label: 'English', id: '1' },
          contact: { status: 'VALID', bspStatus: 'SESSION_AND_HSM', settings: null },
        },
      },
    },
  },

  // ==================== COLLECTIONS ====================
  getGroup: {
    data: {
      group: {
        group: {
          id: '1',
          label: 'Sample Collection',
          roles: [],
          description: 'Test collection',
          users: [{ id: '1', name: 'Test Admin' }],
          contacts: [{ id: '2', name: 'Simulator', phone: '9876543210' }],
          waGroups: [],
        },
      },
    },
  },

  countGroups: {
    data: { countGroups: 1 },
  },

  CountWaGroupsCollection: {
    data: { countWaGroupsCollection: 0 },
  },

  groups: {
    data: {
      groups: [
        {
          id: '1',
          label: 'Sample Collection',
          description: 'Test collection',
          isRestricted: false,
          contactsCount: 1,
          waGroupsCount: 0,
          roles: [],
        },
      ],
    },
  },

  group: {
    data: {
      group: {
        group: {
          id: '1',
          label: 'Sample Collection',
          users: [{ id: '1', name: 'Test Admin' }],
          contacts: [{ id: '2', name: 'Simulator', phone: '9876543210' }],
          waGroups: [],
        },
      },
    },
  },

  groupInfo: {
    data: { groupInfo: '{}' },
  },

  OrganizationGroups: {
    data: { organizationGroups: [{ label: 'Sample Collection', id: '1' }] },
  },

  ExportCollection: {
    data: { exportCollection: { status: 'success', errors: null } },
  },

  createGroup: {
    data: {
      createGroup: {
        group: { id: '2', label: 'New Collection' },
        errors: null,
      },
    },
  },

  updateGroup: {
    data: {
      updateGroup: { group: { id: '1' }, errors: null },
    },
  },

  deleteGroup: {
    data: { deleteGroup: { errors: null } },
  },

  createContactGroup: {
    data: { createContactGroup: { contactGroup: { id: '1' }, errors: null } },
  },

  updateContactGroups: {
    data: { updateContactGroups: { numberDeleted: 0, contactGroups: [] } },
  },

  updateGroupUsers: {
    data: { updateGroupUsers: { numberDeleted: 0, groupUsers: [] } },
  },

  updateGroupContacts: {
    data: { updateGroupContacts: { numberDeleted: 0, groupContacts: [] } },
  },

  UpdateWaGroupCollection: {
    data: { updateWaGroupCollection: { errors: null } },
  },

  UpdateCollectionWaGroup: {
    data: { updateCollectionWaGroup: { errors: null } },
  },

  // ==================== MESSAGES / CHAT ====================
  createAndSendMessage: {
    data: {
      createAndSendMessage: {
        message: { id: '100', body: 'Test message', insertedAt: new Date().toISOString() },
        errors: null,
      },
    },
  },

  markContactMessagesAsRead: {
    data: { markContactMessagesAsRead: '1' },
  },

  createAndSendMessageToGroup: {
    data: {
      createAndSendMessageToGroup: {
        success: true,
        errors: null,
      },
    },
  },

  clearMessages: {
    data: { clearMessages: { success: true, errors: null } },
  },

  createMediaMessage: {
    data: {
      createMediaMessage: {
        messageMedia: { id: '1' },
        errors: null,
      },
    },
  },

  uploadBlob: {
    data: { uploadBlob: 'https://storage.example.com/test.jpg' },
  },

  uploadMedia: {
    data: { uploadMedia: 'https://storage.example.com/test.jpg' },
  },

  createTemplateFormMessage: {
    data: {
      createTemplateFormMessage: {
        sessionTemplate: { id: '1' },
        errors: null,
      },
    },
  },

  // ==================== FLOWS ====================
  flows: {
    data: {
      flows: [
        { id: '1', name: 'AB Test Workflow', uuid: 'flow-uuid-1' },
        { id: '2', name: 'Help Workflow', uuid: 'flow-uuid-2' },
      ],
    },
  },

  getFlow: {
    data: {
      flow: {
        flow: {
          id: '1',
          name: 'AB Test Workflow',
          uuid: 'flow-uuid-1',
          isActive: true,
          isPinned: false,
          description: 'Test flow',
          roles: [],
          tag: null,
          isBackground: false,
          keywords: ['help'],
          ignoreKeywords: false,
          skipValidation: false,
        },
      },
    },
  },

  countFlows: {
    data: { countFlows: 2 },
  },

  getFlows: {
    data: {
      flows: [
        {
          id: '1',
          name: 'AB Test Workflow',
          uuid: 'flow-uuid-1',
          keywords: ['help'],
          description: 'Test flow',
          lastChangedAt: new Date().toISOString(),
          isBackground: false,
          lastPublishedAt: new Date().toISOString(),
          ignoreKeywords: false,
          updatedAt: new Date().toISOString(),
          isActive: true,
          isPinned: false,
          roles: [],
          tag: null,
        },
      ],
    },
  },

  getFlowName: {
    data: {
      flows: [
        { id: '1', isActive: true, name: 'AB Test Workflow', keywords: ['help'], isTemplate: false, skipValidation: false },
      ],
    },
  },

  exportFlow: {
    data: { exportFlow: { exportData: '{}' } },
  },

  flowGet: {
    data: {
      flowGet: {
        flow: { id: '1', uuid: 'flow-uuid-1' },
        errors: null,
      },
    },
  },

  flowRelease: {
    data: { flowRelease: { id: '1', uuid: 'flow-uuid-1' } },
  },

  deleteFlow: {
    data: { deleteFlow: { errors: null } },
  },

  createFlow: {
    data: {
      createFlow: {
        flow: { id: '3', name: 'New Flow', uuid: 'flow-uuid-3' },
        errors: null,
      },
    },
  },

  updateFlow: {
    data: {
      updateFlow: { flow: { id: '1' }, errors: null },
    },
  },

  UpdateFlow: {
    data: {
      updateFlow: { flow: { id: '1' }, errors: null },
    },
  },

  publishFlow: {
    data: {
      publishFlow: { success: true, errors: null },
    },
  },

  startContactFlow: {
    data: { startContactFlow: { success: true, errors: null } },
  },

  startGroupFlow: {
    data: { startGroupFlow: { success: true, errors: null } },
  },

  StartWaGroupFlow: {
    data: { startWaGroupFlow: { success: true, errors: null } },
  },

  StartWaGroupCollectionFlow: {
    data: { startWaGroupCollectionFlow: { success: true, errors: null } },
  },

  copyFlow: {
    data: {
      copyFlow: { flow: { id: '4', name: 'Copy of Flow' }, errors: null },
    },
  },

  importFlow: {
    data: { importFlow: { success: true, errors: null } },
  },

  ResetFlowCount: {
    data: { resetFlowCount: { success: true, errors: null } },
  },

  TerminateContactFlows: {
    data: { terminateContactFlows: { success: true, errors: null } },
  },

  // ==================== TEMPLATES ====================
  countSessionTemplates: {
    data: { countSessionTemplates: 1 },
  },

  sessionTemplates: {
    data: {
      sessionTemplates: [
        {
          id: '1',
          body: 'Hello {{1}}',
          footer: null,
          label: 'Test Template',
          isHsm: true,
          updatedAt: new Date().toISOString(),
          translations: '{}',
          type: 'TEXT',
          quality: null,
          category: 'UTILITY',
          language: { id: '1', label: 'English' },
          bspId: 'bsp-1',
          shortcode: 'test_template',
          status: 'APPROVED',
          reason: null,
          isReserved: false,
          isActive: true,
          numberParameters: 1,
          MessageMedia: null,
        },
      ],
    },
  },

  getsessionTemplate: {
    data: {
      sessionTemplate: {
        sessionTemplate: {
          id: '1',
          body: 'Hello {{1}}',
          footer: null,
          label: 'Test Template',
          isHsm: true,
          updatedAt: new Date().toISOString(),
          translations: '{}',
          type: 'TEXT',
          quality: null,
          category: 'UTILITY',
          language: { id: '1', label: 'English' },
          isActive: true,
          MessageMedia: null,
          tag: null,
          shortcode: 'test_template',
          example: null,
          hasButtons: false,
          buttons: null,
          buttonType: null,
        },
      },
    },
  },

  SessionTemplate: {
    data: {
      sessionTemplate: {
        sessionTemplate: {
          id: '1',
          body: 'Hello',
          isActive: true,
          label: 'Speed Send 1',
          translations: '{}',
          type: 'TEXT',
          language: { id: '1', label: 'English' },
          messageMedia: null,
        },
      },
    },
  },

  whatsappHsmCategories: {
    data: { whatsappHsmCategories: ['UTILITY', 'MARKETING', 'AUTHENTICATION'] },
  },

  deleteSessionTemplate: {
    data: { deleteSessionTemplate: { errors: null } },
  },

  createSessionTemplate: {
    data: {
      createSessionTemplate: {
        sessionTemplate: { id: '2', label: 'New Template' },
        errors: null,
      },
    },
  },

  updateSessionTemplate: {
    data: {
      updateSessionTemplate: {
        sessionTemplate: { id: '1' },
        errors: null,
      },
    },
  },

  syncHsmTemplate: {
    data: { syncHsmTemplate: { errors: null, message: 'success' } },
  },

  ImportTemplates: {
    data: { importTemplates: { errors: null } },
  },

  BulkApplyTemplates: {
    data: { bulkApplyTemplates: { errors: null, csv_rows: null } },
  },

  ReportToGupshup: {
    data: { reportToGupshup: { errors: null, message: 'success' } },
  },

  // ==================== INTERACTIVE MESSAGES ====================
  countInteractiveTemplates: {
    data: { countInteractiveTemplates: 1 },
  },

  interactiveTemplates: {
    data: {
      interactiveTemplates: [
        {
          id: '1',
          label: 'Test Interactive',
          interactiveContent: '{"type":"quick_reply","content":{"text":"Test"},"options":[{"title":"Yes"},{"title":"No"}]}',
          type: 'QUICK_REPLY',
          translations: '{}',
          sendWithTitle: true,
          language: { id: '1', label: 'English' },
        },
      ],
    },
  },

  getInteractiveTemplate: {
    data: {
      interactiveTemplate: {
        interactiveTemplate: {
          id: '1',
          label: 'Test Interactive',
          interactiveContent: '{"type":"quick_reply","content":{"text":"Test"},"options":[{"title":"Yes"},{"title":"No"}]}',
          sendWithTitle: true,
          type: 'QUICK_REPLY',
          translations: '{}',
          language: { id: '1', label: 'English' },
          tag: null,
        },
      },
    },
  },

  createInteractiveTemplate: {
    data: {
      createInteractiveTemplate: {
        interactiveTemplate: { id: '2', label: 'New Interactive' },
        errors: null,
      },
    },
  },

  updateInteractiveTemplate: {
    data: {
      updateInteractiveTemplate: {
        interactiveTemplate: { id: '1' },
        errors: null,
      },
    },
  },

  deleteInteractiveTemplate: {
    data: { deleteInteractiveTemplate: { errors: null } },
  },

  CopyInteractiveTemplate: {
    data: {
      copyInteractiveTemplate: {
        interactiveTemplate: { id: '3' },
        errors: null,
      },
    },
  },

  TranslateInteractiveTemplate: {
    data: { translateInteractiveTemplate: { interactiveTemplate: { id: '1' }, errors: null } },
  },

  ExportInteractiveTemplate: {
    data: { exportInteractiveTemplate: { exportData: '{}' } },
  },

  ImportInteractiveTemplate: {
    data: { importInteractiveTemplate: { interactiveTemplate: { id: '1' }, errors: null } },
  },

  // ==================== TRIGGERS ====================
  triggers: {
    data: {
      triggers: [
        {
          id: '1',
          name: 'Test Trigger',
          days: [1, 2, 3, 4, 5],
          frequency: 'daily',
          flow: { id: '1', name: 'AB Test Workflow' },
          groups: '[]',
          roles: [],
          nextTriggerAt: new Date().toISOString(),
          endDate: null,
          isActive: true,
          isRepeating: true,
          startAt: new Date().toISOString(),
        },
      ],
    },
  },

  getTrigger: {
    data: {
      trigger: {
        trigger: {
          days: [1, 2, 3, 4, 5],
          endDate: null,
          flow: { id: '1' },
          frequency: 'daily',
          groups: '[]',
          hours: [],
          roles: [],
          id: '1',
          isActive: true,
          isRepeating: true,
          startAt: new Date().toISOString(),
          groupType: 'WABA',
        },
      },
    },
  },

  countTriggers: {
    data: { countTriggers: 1 },
  },

  deleteTrigger: {
    data: { deleteTrigger: { errors: null } },
  },

  ValidateTrigger: {
    data: { validateTrigger: { errors: null, success: true } },
  },

  createTrigger: {
    data: {
      createTrigger: {
        trigger: { id: '2' },
        errors: null,
      },
    },
  },

  updateTrigger: {
    data: {
      updateTrigger: { trigger: { id: '1' }, errors: null },
    },
  },

  // ==================== TAGS ====================
  Tags: {
    data: {
      tags: [
        { id: '1', label: 'Important', description: null, colorCode: '#0C976D', parent: null },
        { id: '2', label: 'Not replied', description: null, colorCode: '#0C976D', parent: null },
      ],
    },
  },

  getTag: {
    data: {
      tag: {
        tag: {
          id: '1',
          label: 'Important',
          description: null,
          colorCode: '#0C976D',
          parent: null,
          language: { id: '1' },
        },
      },
    },
  },

  countTags: {
    data: { countTags: 2 },
  },

  CreateTag: {
    data: {
      createTag: { tag: { id: '3', label: 'New Tag' }, errors: null },
    },
  },

  UpdateTag: {
    data: {
      updateTag: { tag: { id: '1' }, errors: null },
    },
  },

  DeleteTag: {
    data: { deleteTag: { errors: null } },
  },

  // ==================== NOTIFICATIONS ====================
  notifications: {
    data: {
      notifications: [
        {
          id: '1',
          category: 'Message',
          entity: '{}',
          message: 'Test notification',
          severity: '"information"',
          updatedAt: new Date().toISOString(),
          isRead: false,
        },
      ],
    },
  },

  countNotifications: {
    data: { countNotifications: 1 },
  },

  markNotificationAsRead: {
    data: { markNotificationAsRead: null },
  },

  // ==================== LANGUAGES ====================
  languages: {
    data: {
      languages: [
        { id: '1', label: 'English' },
        { id: '2', label: 'Hindi' },
      ],
    },
  },

  // ==================== SETTINGS ====================
  attachmentsEnabled: {
    data: { attachmentsEnabled: true },
  },

  updateOrganization: {
    data: {
      updateOrganization: {
        organization: { id: '1' },
        errors: null,
      },
    },
  },

  createCredential: {
    data: { createCredential: { credential: { id: '1' }, errors: null } },
  },

  updateCredential: {
    data: { updateCredential: { credential: { id: '1' }, errors: null } },
  },

  // ==================== ROLES ====================
  AccessRoles: {
    data: {
      accessRoles: [
        { id: '1', label: 'Admin', description: 'Administrator', insertedAt: new Date().toISOString(), isReserved: true },
        { id: '2', label: 'Manager', description: 'Manager role', insertedAt: new Date().toISOString(), isReserved: true },
        { id: '3', label: 'Staff', description: 'Staff role', insertedAt: new Date().toISOString(), isReserved: true },
      ],
    },
  },

  CountAccessRoles: {
    data: { countAccessRoles: 3 },
  },

  AccessRole: {
    data: {
      accessRole: {
        accessRole: {
          description: 'Administrator',
          insertedAt: new Date().toISOString(),
          isReserved: true,
          label: 'Admin',
        },
      },
    },
  },

  CreateRole: {
    data: { createRole: { accessRole: { id: '4' }, errors: null } },
  },

  UpdateRole: {
    data: { updateRole: { accessRole: { id: '1' }, errors: null } },
  },

  DeleteRole: {
    data: { deleteRole: { errors: null } },
  },

  // ==================== SIMULATOR ====================
  MyQuery: {
    data: {
      simulatorGet: { id: '1', name: 'Simulator' },
      simulatorRelease: null,
    },
  },

  // ==================== WA GROUPS ====================
  WaSearch: {
    data: {
      search: [
        {
          id: 'wa_group_1',
          group: null,
          waGroup: {
            bspId: '1',
            id: '1',
            label: 'Test WA Group',
            lastCommunicationAt: new Date().toISOString(),
            waManagedPhone: { id: '1', label: 'Test Phone', phone: '917834811114', phoneId: 1 },
          },
          messages: [],
        },
      ],
    },
  },

  WaSearchMulti: {
    data: { searchMulti: { contacts: [], messages: [], labels: [] } },
  },

  WaManagedPhones: {
    data: { waManagedPhones: [{ id: '1', label: 'Test Phone', phone: '917834811114', phoneId: 1 }] },
  },

  waGroupsCount: {
    data: { waGroupsCount: 1 },
  },

  WaGroups: {
    data: {
      waGroups: [
        { bspId: '1', id: '1', lastCommunicationAt: new Date().toISOString(), label: 'Test WA Group' },
      ],
    },
  },

  ListContactWaGroup: {
    data: { listContactWaGroup: [] },
  },

  CountContactWaGroup: {
    data: { countContactWaGroup: 0 },
  },

  WaGroup: {
    data: {
      waGroup: {
        waGroup: {
          bspId: '1',
          id: '1',
          label: 'Test WA Group',
          lastCommunicationAt: new Date().toISOString(),
          waManagedPhone: { id: '1', label: 'Test Phone', phone: '917834811114', phoneId: 1 },
        },
      },
    },
  },

  SendMessageInWaGroup: {
    data: { sendMessageInWaGroup: { message: { id: '1' }, errors: null } },
  },

  SyncWaGroupContacts: {
    data: { syncWaGroupContacts: { message: 'success' } },
  },

  UpdateContactWaGroups: {
    data: { updateContactWaGroups: { errors: null } },
  },

  CreateContactWaGroup: {
    data: { createContactWaGroup: { contactWaGroup: { id: '1' }, errors: null } },
  },

  SendMessageToWaGroupCollection: {
    data: { sendMessageToWaGroupCollection: { success: true, errors: null } },
  },

  // ==================== WA POLLS ====================
  WaPolls: {
    data: {
      poll: [
        { allowMultipleAnswer: false, id: '1', label: 'Test Poll', pollContent: '{"options":["Yes","No"]}', uuid: 'poll-uuid-1' },
      ],
    },
  },

  WaPoll: {
    data: {
      waPoll: {
        waPoll: { id: '1', label: 'Test Poll', pollContent: '{"options":["Yes","No"]}', allowMultipleAnswer: false },
        errors: null,
      },
    },
  },

  RootQueryType: {
    data: { countPoll: 1, countWaPolls: 1 },
  },

  CreateWaPoll: {
    data: { createWaPoll: { waPoll: { id: '2' }, errors: null } },
  },

  CopyWaPoll: {
    data: { copyWaPoll: { waPoll: { id: '3' }, errors: null } },
  },

  DeleteWaPoll: {
    data: { deleteWaPoll: { errors: null } },
  },

  // ==================== ASSISTANTS / FILE SEARCH ====================
  // (Already mocked in Filesearch.spec.ts - these are fallback defaults)
  Assistants: {
    data: { assistants: [] },
  },

  Assistant: {
    data: {
      assistant: {
        assistant: { id: '1', name: 'Test Assistant' },
      },
    },
  },

  ListOpenaiModels: {
    data: { listOpenaiModels: ['gpt-4', 'gpt-3.5-turbo'] },
  },

  CreateAssistant: {
    data: { createAssistant: { assistant: { id: '1' }, errors: null } },
  },

  UpdateAssistant: {
    data: { updateAssistant: { assistant: { id: '1' }, errors: null } },
  },

  DeleteAssistant: {
    data: { deleteAssistant: { errors: null } },
  },

  UploadFilesearchFile: {
    data: { uploadFilesearchFile: { url: 'https://storage.example.com/file.pdf' } },
  },

  AddAssistantFiles: {
    data: { addAssistantFiles: { errors: null } },
  },

  RemoveAssistantFile: {
    data: { removeAssistantFile: { errors: null } },
  },

  GetAssistantFiles: {
    data: { getAssistantFiles: [] },
  },

  // ==================== WHATSAPP FORMS ====================
  // (Already mocked in wa_form.spec.ts - these are fallback defaults)
  listWhatsappForms: {
    data: { listWhatsappForms: [] },
  },

  WhatsappForm: {
    data: {
      whatsappForm: {
        whatsappForm: { id: '1', label: 'Test Form' },
      },
    },
  },

  countWhatsappForms: {
    data: { countWhatsappForms: 0 },
  },

  CreateWhatsappForm: {
    data: { createWhatsappForm: { whatsappForm: { id: '1' }, errors: null } },
  },

  UpdateWhatsappForm: {
    data: { updateWhatsappForm: { whatsappForm: { id: '1' }, errors: null } },
  },

  DeleteWhatsappForm: {
    data: { deleteWhatsappForm: { errors: null } },
  },

  publishWhatsappForm: {
    data: { publishWhatsappForm: { errors: null } },
  },

  DeactivateWhatsappForm: {
    data: { deactivateWhatsappForm: { errors: null } },
  },

  ActivateWhatsappForm: {
    data: { activateWhatsappForm: { errors: null } },
  },

  SaveWhatsappFormRevision: {
    data: { saveWhatsappFormRevision: { errors: null } },
  },

  RevertToWhatsappFormRevision: {
    data: { revertToWhatsappFormRevision: { errors: null } },
  },

  syncWhatsappForm: {
    data: { syncWhatsappForm: { errors: null } },
  },

  WhatsappFormRevision: {
    data: { whatsappFormRevision: null },
  },

  ListWhatsappFormRevisions: {
    data: { listWhatsappFormRevisions: [] },
  },

  // ==================== FLOW LABELS ====================
  flowLabels: {
    data: { flowLabels: [] },
  },

  // ==================== SHEETS ====================
  Sheets: {
    data: { sheets: [] },
  },

  Sheet: {
    data: { sheet: null },
  },

  countSheets: {
    data: { countSheets: 0 },
  },

  // ==================== EXTENSIONS ====================
  Extension: {
    data: { extension: null },
  },

  getOrganizationExtension: {
    data: { getOrganizationExtension: null },
  },

  // ==================== TICKETS ====================
  Tickets: {
    data: { tickets: [] },
  },

  getTicket: {
    data: { ticket: null },
  },

  countTickets: {
    data: { countTickets: 0 },
  },

  updateTicket: {
    data: { updateTicket: { ticket: { id: '1' }, errors: null } },
  },

  // ==================== CONTACT FIELDS ====================
  contactsFields: {
    data: { contactsFields: [] },
  },

  contactsField: {
    data: { contactsField: null },
  },

  countContactsFields: {
    data: { countContactsFields: 0 },
  },

  // ==================== BILLING ====================
  getOrganizationBilling: {
    data: { getOrganizationBilling: null },
  },

  getCustomerPortal: {
    data: { getCustomerPortal: null },
  },

  // ==================== WEBHOOK LOGS ====================
  webhookLogs: {
    data: { webhookLogs: [] },
  },

  countWebhookLogs: {
    data: { countWebhookLogs: 0 },
  },

  // ==================== CERTIFICATES ====================
  CertificateTemplates: {
    data: { certificateTemplates: [] },
  },

  CertificateTemplate: {
    data: { certificateTemplate: null },
  },

  // ==================== CONSULTING ====================
  consultingHours: {
    data: { consultingHours: [] },
  },

  countConsultingHours: {
    data: { countConsultingHours: 0 },
  },
};

// Per-test overrides. Test files can set overrides BEFORE cy.visit().
// The global handler checks this map at REQUEST TIME (not registration time),
// so ordering of cy.intercept registrations doesn't matter.
const testOverrides = {};

// Register cy.overrideMock() command so test files can override specific operations.
// Usage: cy.overrideMock('Assistants', { data: { assistants: [...] } })
// Or with a function: cy.overrideMock('Assistant', (req) => ({ data: { ... } }))
Cypress.Commands.add('overrideMock', (operationName, response) => {
  testOverrides[operationName] = response;
});

/**
 * Sets up the global GraphQL intercept. Uses a SINGLE interceptor
 * that checks testOverrides first, then falls back to default mockResponses.
 *
 * Each request gets req.alias set to the operationName, so tests can
 * use cy.wait('@OperationName') to wait for specific queries/mutations.
 */
function setupGraphQLMocks() {
  // Clear any overrides from previous test
  Object.keys(testOverrides).forEach((key) => delete testOverrides[key]);

  cy.intercept('POST', '**/api', (req) => {
    const { operationName } = req.body;

    // Set alias to operationName so tests can cy.wait('@Assistants') etc.
    if (operationName) {
      req.alias = operationName;
    }

    // 1. Check test-specific overrides first
    if (operationName && testOverrides[operationName]) {
      const override = testOverrides[operationName];
      const body = typeof override === 'function' ? override(req) : override;
      req.reply({ statusCode: 200, body });
      return;
    }

    // 2. Fall back to default mock responses
    if (operationName && mockResponses[operationName]) {
      req.reply({
        statusCode: 200,
        body: mockResponses[operationName],
      });
    } else if (operationName) {
      // Unknown operation - return empty success to prevent backend calls
      req.reply({
        statusCode: 200,
        body: { data: {} },
      });
    }
  }).as('graphqlMock');
}

export { setupGraphQLMocks, overrideMock, mockResponses };

// Also keep overrideMock accessible for direct import (though cy.overrideMock is preferred)
function overrideMock(operationName, response) {
  testOverrides[operationName] = response;
}
