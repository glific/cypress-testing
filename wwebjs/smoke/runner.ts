import * as qrcode from 'qrcode-terminal';
import { Client, Message, RemoteAuth } from 'whatsapp-web.js';
import { ENVIRONMENTS, ExpectedMessage, FlowDefinition, FLOWS, TargetEnvironment } from './flows';
import { GCSRemoteAuthStore } from './gcs-store';
import { reportToInstatus } from './instatus';

const READY_TIMEOUT_MS = 120_000;

function resolveEnvName(): string {
  const fromArg = process.argv.find((a) => a.startsWith('--env='))?.split('=')[1];
  return fromArg ?? process.env.WHATSAPP_TARGET_ENV ?? 'production';
}

function resolveFlowId(): string {
  const fromArg = process.argv.find((a) => a.startsWith('--flow='))?.split('=')[1];
  return fromArg ?? process.env.WHATSAPP_FLOW_ID ?? 'smoke-test';
}

function normalizeBotId(phoneNumber: string): string {
  return phoneNumber.replace(/[+\s]/g, '') + '@c.us';
}

function remoteAuthSessionName(clientId: string): string {
  return `RemoteAuth-${clientId}`;
}

function waitForRemoteSessionSaved(client: Client, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Session was not saved to GCS within ${timeoutMs / 1000}s`));
    }, timeoutMs);

    client.once('remote_session_saved', () => {
      clearTimeout(timer);
      console.log('Remote session saved to GCS');
      resolve();
    });
  });
}

function waitForReady(client: Client): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          'WhatsApp client did not become ready within 120s.\n' +
            'If no session exists in GCS, run "yarn wa:smoke" locally, scan the QR code, ' +
            'then re-trigger CI once the session has been uploaded.'
        )
      );
    }, READY_TIMEOUT_MS);

    client.once('ready', () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

function collectMessages(
  client: Client,
  expectedFrom: string,
  count: number,
  timeoutMs: number
): Promise<Message[]> {
  return new Promise((resolve, reject) => {
    const collected: Message[] = [];
    const timer = setTimeout(() => {
      client.off('message', onMessage);
      reject(
        new Error(
          `Timed out waiting for ${count} message(s) from ${expectedFrom}. ` +
            `Received ${collected.length} within ${timeoutMs / 1000}s.`
        )
      );
    }, timeoutMs);

    const onMessage = (msg: Message) => {
      if (msg.from !== expectedFrom) {
        console.log(`Ignoring message from ${msg.from} (expected ${expectedFrom})`);
        return;
      }
      const bodyPreview = msg.body.slice(0, 80);
      const mediaSuffix = msg.hasMedia ? ` mediaType: ${msg.type}` : '';
      console.log(
        `[${collected.length + 1}/${count}] From: ${msg.from} Received: ${bodyPreview}${mediaSuffix}`
      );
      collected.push(msg);
      if (collected.length === count) {
        clearTimeout(timer);
        client.off('message', onMessage);
        resolve(collected);
      }
    };

    client.on('message', onMessage);
  });
}

async function assertMessages(messages: Message[], expected: ExpectedMessage[]): Promise<void> {
  for (let i = 0; i < expected.length; i++) {
    const msg = messages[i];
    const exp = expected[i];

    if (exp.containsText && !msg.body.includes(exp.containsText)) {
      throw new Error(
        `Message[${i}]: expected body to contain "${exp.containsText}", got: "${msg.body}"`
      );
    }
    if (exp.exactText && msg.body !== exp.exactText) {
      throw new Error(`Message[${i}]: expected exact body "${exp.exactText}", got: "${msg.body}"`);
    }
    if (exp.hasMedia && !msg.hasMedia) {
      throw new Error(`Message[${i}]: expected media attachment, but none present`);
    }
    if (exp.mediaType) {
      const media = await msg.downloadMedia();
      if (!media?.mimetype.startsWith(exp.mediaType)) {
        throw new Error(
          `Message[${i}]: expected mediaType "${exp.mediaType}", got "${media?.mimetype ?? 'none'}"`
        );
      }
    }
  }
}

async function main(): Promise<void> {
  const envName = resolveEnvName();
  const flowId = resolveFlowId();

  const env: TargetEnvironment | undefined = ENVIRONMENTS[envName];
  if (!env) {
    console.error(
      `Unknown environment: "${envName}". Available: ${Object.keys(ENVIRONMENTS).join(', ')}`
    );
    process.exit(1);
  }

  const flow: FlowDefinition | undefined = FLOWS[flowId];
  if (!flow) {
    console.error(`Unknown flow: "${flowId}". Available: ${Object.keys(FLOWS).join(', ')}`);
    process.exit(1);
  }

  if (!env.gcsBucket) {
    console.error('GCS_BUCKET env var is required');
    process.exit(1);
  }

  console.log(`\n=== WhatsApp Flow Smoke Test ===`);
  console.log(`Environment : ${env.name}`);
  console.log(`Bot number  : ${env.botPhoneNumber}`);
  console.log(`Flow        : ${flow.id} — ${flow.description}`);
  console.log(`Session ID  : ${env.sessionId}`);
  console.log(`GCS bucket  : ${env.gcsBucket}\n`);

  const sessionName = remoteAuthSessionName(env.sessionId);
  const store = new GCSRemoteAuthStore({
    bucket: env.gcsBucket,
    keyFilename: process.env.GCS_KEY_FILE,
  });
  const sessionAlreadyInGcs = await store.sessionExists({ session: sessionName });
  if (sessionAlreadyInGcs) {
    console.log(`GCS session found: ${sessionName}`);
  } else {
    console.log(`No GCS session yet for ${sessionName}; QR scan will upload after ~60s`);
  }

  const client = new Client({
    authStrategy: new RemoteAuth({
      store,
      clientId: env.sessionId,
      backupSyncIntervalMs: 300_000,
    }),
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });

  client.on('qr', (qr: string) => {
    console.log('\nScan this QR code with WhatsApp on the sender device:\n');
    qrcode.generate(qr, { small: true });
    console.log('\nWaiting for QR scan...');
  });

  client.on('authenticated', () => console.log('Authenticated'));
  client.on('auth_failure', (msg: string) => console.error('Auth failure:', msg));

  const botId = normalizeBotId(env.botPhoneNumber);
  const timeoutMs = flow.timeoutMs ?? 120_000;

  const instatusApiKey = process.env.INSTATUS_API_KEY ?? '';
  let passed = false;

  try {
    await client.initialize();
    await waitForReady(client);
    console.log('Client ready. Sending trigger message...');

    const chat = await client.getChatById(botId);
    const sent = await chat.sendMessage(flow.triggerMessage);
    const botFromId = sent.to;
    console.log(
      `Sent: "${flow.triggerMessage}" (to ${botFromId})\n` +
        `Waiting for ${flow.expectedResponses.length} response(s) from ${botFromId}...\n`
    );

    const messages = await collectMessages(
      client,
      botFromId,
      flow.expectedResponses.length,
      timeoutMs
    );
    await assertMessages(messages, flow.expectedResponses);

    console.log('\nAll assertions passed.');
    passed = true;
  } catch (err) {
    console.error('\nTest failed:', (err as Error).message);
    passed = false;
  } finally {
    if (!sessionAlreadyInGcs) {
      try {
        await waitForRemoteSessionSaved(client, 90_000);
      } catch (err) {
        console.warn('Session may not have been uploaded to GCS:', (err as Error).message);
      }
    }

    await reportToInstatus(instatusApiKey, env.instatus.pageId, env.instatus.componentId, passed);

    try {
      await client.destroy();
    } catch {
      // ignore cleanup errors
    }

    process.exit(passed ? 0 : 1);
  }
}

main();
