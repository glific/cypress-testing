export interface ExpectedMessage {
  containsText?: string;
  exactText?: string;
  hasMedia?: boolean;
  mediaType?: 'image' | 'audio' | 'video' | 'document' | 'sticker';
}

export interface FlowDefinition {
  id: string;
  description: string;
  triggerMessage: string;
  expectedResponses: ExpectedMessage[];
  timeoutMs?: number;
}

export interface TargetEnvironment {
  name: string;
  botPhoneNumber: string;
  sessionId: string;
  gcsBucket: string;
  instatus: {
    pageId: string;
    componentId: string;
  };
}

export const FLOWS: Record<string, FlowDefinition> = {
  'smoke-test': {
    id: 'smoke-test',
    description: 'Verify core flow: date message → elephant text → audio',
    triggerMessage: 'smoke',
    expectedResponses: [
      { containsText: 'World!' },
      { containsText: 'elephant' },
      { hasMedia: true, mediaType: 'audio' },
    ],
    timeoutMs: 120_000,
  },
};

export const ENVIRONMENTS: Record<string, TargetEnvironment> = {
  production: {
    name: 'production',
    botPhoneNumber: process.env.BOT_PHONE_NUMBER ?? '',
    sessionId: process.env.WHATSAPP_SESSION_ID ?? 'production-sender',
    gcsBucket: process.env.GCS_BUCKET ?? '',
    instatus: {
      pageId: process.env.INSTATUS_PAGE_ID ?? '',
      componentId: process.env.INSTATUS_COMPONENT_ID ?? '',
    },
  },
  staging: {
    name: 'staging',
    botPhoneNumber: process.env.BOT_PHONE_NUMBER ?? '',
    sessionId: process.env.WHATSAPP_SESSION_ID ?? 'staging-sender',
    gcsBucket: process.env.GCS_BUCKET ?? '',
    instatus: {
      pageId: process.env.INSTATUS_PAGE_ID ?? '',
      componentId: process.env.INSTATUS_COMPONENT_ID ?? '',
    },
  },
};
