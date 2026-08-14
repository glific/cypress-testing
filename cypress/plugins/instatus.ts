// Instatus only notifies subscribers/integrations (e.g. Discord) via *incidents* —
// a bare component status update does not. So we manage the lifecycle of a single
// incident: open one (notify: true) when the smoke test fails, and resolve it
// (notify: true) when it passes again. State lives in Instatus, not the CI job:
// every run reconciles against the current open/closed incident, which is how a
// later passing run closes an incident an earlier failing run opened.

const API_BASE = 'https://api.instatus.com/v1';
const API_BASE_V2 = 'https://api.instatus.com/v2';

// Stable name used to find *our* incident among any others on the page.
const INCIDENT_NAME = 'Flow smoke test failing';

interface Incident {
  id: string;
  name: string;
  status: string;
  started: string;
}

function authHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

// Open incidents (resolved === null) previously raised by this smoke check.
async function getOpenIncidents(apiKey: string, pageId: string): Promise<Incident[]> {
  const res = await fetch(`${API_BASE}/${pageId}/incidents?per_page=100`, {
    headers: authHeaders(apiKey),
  });
  if (!res.ok) {
    console.error(`Instatus: failed to list incidents → HTTP ${res.status}`);
    return [];
  }
  const raw: unknown = await res.json();
  const incidents: Incident[] = Array.isArray(raw)
    ? (raw as Incident[])
    : (raw as { incidents?: Incident[]; data?: Incident[] }).incidents ??
      (raw as { data?: Incident[] }).data ??
      [];
  return incidents.filter((i) => i.name === INCIDENT_NAME && i.status !== 'RESOLVED');
}

async function createIncident(apiKey: string, pageId: string, componentId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${pageId}/incidents`, {
    method: 'POST',
    headers: authHeaders(apiKey),
    body: JSON.stringify({
      name: INCIDENT_NAME,
      message: 'The automated Glific flow smoke test failed.',
      status: 'INVESTIGATING',
      notify: true,
      components: [componentId],
      statuses: [{ id: componentId, status: 'MAJOROUTAGE' }],
    }),
  });
  console.log(`Instatus: opened incident (notify) → HTTP ${res.status}`);
}

async function resolveIncident(
  apiKey: string,
  pageId: string,
  incidentId: string,
  resolveTemplateId: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE_V2}/${pageId}/incidents/${incidentId}/incident-updates/${resolveTemplateId}`,
    {
      method: 'POST',
      headers: authHeaders(apiKey),
    }
  );
  console.log(`Instatus: resolved incident ${incidentId} (notify) → HTTP ${res.status}`);
}

export async function reportToInstatus(
  apiKey: string,
  pageId: string,
  componentId: string,
  resolveTemplateId: string,
  passed: boolean
): Promise<null> {
  if (!apiKey || !pageId || !componentId || !resolveTemplateId) {
    console.warn('Instatus credentials not set — skipping status report');
    return null;
  }
  try {
    const openIncidents = await getOpenIncidents(apiKey, pageId);

    if (passed) {
      // Recovery: resolve any incident this check left open. If none, we were
      // already healthy — do nothing so subscribers aren't pinged needlessly.
      if (openIncidents.length === 0) {
        console.log('Instatus: smoke passing, no open incident — nothing to do');
      } else {
        for (const incident of openIncidents) {
          await resolveIncident(apiKey, pageId, incident.id, resolveTemplateId);
        }
      }
    } else if (openIncidents.length > 0) {
      // Sustained outage: an incident is already open — leave it so we don't
      // re-notify Discord on every run (one incident per outage).
      console.log(
        `Instatus: smoke failing, incident ${openIncidents[0].id} already open — not re-notifying`
      );
    } else {
      // First failure of this outage: open (and announce) a new incident.
      await createIncident(apiKey, pageId, componentId);
    }
  } catch (err) {
    console.error('Instatus report failed:', err);
  }
  return null;
}
