// ============================================================
// Zoey OS — Mock Data Layer (simulates the control-plane API)
// ============================================================

export type Status = 'active' | 'idle' | 'error' | 'disabled' | 'running' | 'draft';

export interface Plugin {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author: string;
  status: 'installed' | 'available' | 'update';
  permissions: string[];
  icon: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  group: string;
  status: Status;
  latencyMs: number;
  callsToday: number;
  icon: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: number; // 0-100 proficiency
  source: 'learned' | 'trained' | 'inherited';
  lastUsed: string;
  icon: string;
}

export interface Connector {
  id: string;
  name: string;
  service: string;
  status: 'connected' | 'disconnected' | 'auth-required' | 'available';
  scopes: string[];
  lastSync: string;
  icon: string;
  color: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'active' | 'standby' | 'working' | 'paused';
  tasksDone: number;
  activeTask?: string;
  autonomy: number; // 0-3
  icon: string;
}

export interface WorkflowNode {
  id: string;
  label: string;
  kind: 'trigger' | 'action' | 'agent' | 'condition' | 'output';
  x: number;
  y: number;
}

export interface WorkflowEdge {
  from: string;
  to: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'paused' | 'draft';
  runsToday: number;
  successRate: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  lastRun: string;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'linked' | 'available';
  features: string[];
  icon: string;
}

// ---------------- Plugins ----------------
export const plugins: Plugin[] = [
  { id: 'p1', name: 'Voice Interface', description: 'Wake-word detection, streaming STT and natural TTS voice synthesis.', category: 'Interface', version: '2.4.1', author: 'Zoey Labs', status: 'installed', permissions: ['microphone', 'speaker'], icon: '🎙️' },
  { id: 'p2', name: 'Vision Core', description: 'Camera & screen understanding with OCR, scene graph and object tracking.', category: 'Perception', version: '3.1.0', author: 'Zoey Labs', status: 'installed', permissions: ['camera', 'screen'], icon: '👁️' },
  { id: 'p3', name: 'Smart Home Hub', description: 'Control lights, climate, locks and appliances via local + cloud bridges.', category: 'Automation', version: '1.9.3', author: 'HomeBridge', status: 'update', permissions: ['local-network', 'devices'], icon: '🏠' },
  { id: 'p4', name: 'Code Sentinel', description: 'Real-time repo monitoring, PR review and vulnerability scanning.', category: 'Developer', version: '2.0.0', author: 'DevShield', status: 'installed', permissions: ['git', 'filesystem'], icon: '🛡️' },
  { id: 'p5', name: 'Research Engine', description: 'Deep web research with citation tracking and source triangulation.', category: 'Knowledge', version: '1.6.2', author: 'Zoey Labs', status: 'available', permissions: ['network'], icon: '🔬' },
  { id: 'p6', name: 'Calendar Orchestrator', description: 'Auto-schedules meetings, defends focus blocks, negotiates time.', category: 'Productivity', version: '2.2.0', author: 'TimeWeave', status: 'installed', permissions: ['calendar', 'email'], icon: '📅' },
  { id: 'p7', name: 'Security Watchdog', description: 'Anomaly detection on logins, devices and network flows with auto-isolation.', category: 'Security', version: '4.0.1', author: 'Zoey Labs', status: 'installed', permissions: ['system', 'network', 'logs'], icon: '🔐' },
  { id: 'p8', name: 'Media Composer', description: 'Generates images, edits video and produces podcast-ready audio.', category: 'Creative', version: '0.9.7', author: 'PixelForge', status: 'available', permissions: ['filesystem', 'gpu'], icon: '🎨' },
];

// ---------------- Tools ----------------
export const tools: Tool[] = [
  { id: 't1', name: 'web.search', description: 'Query the live web, rank and summarize results.', group: 'Information', status: 'active', latencyMs: 320, callsToday: 1284, icon: '🌐' },
  { id: 't2', name: 'fs.read / fs.write', description: 'Sandboxed file operations within granted roots.', group: 'System', status: 'active', latencyMs: 4, callsToday: 3921, icon: '📁' },
  { id: 't3', name: 'shell.exec', description: 'Run commands in isolated containers, approval-gated.', group: 'System', status: 'idle', latencyMs: 90, callsToday: 210, icon: '⌨️' },
  { id: 't4', name: 'browser.act', description: 'Headless browser: click, type, scrape, fill forms.', group: 'Automation', status: 'active', latencyMs: 1400, callsToday: 87, icon: '🧭' },
  { id: 't5', name: 'email.send', description: 'Draft and send through linked accounts, always previewed.', group: 'Communication', status: 'active', latencyMs: 600, callsToday: 42, icon: '✉️' },
  { id: 't6', name: 'calendar.query', description: 'Read availability, events and free/busy across calendars.', group: 'Communication', status: 'active', latencyMs: 250, callsToday: 316, icon: '🗓️' },
  { id: 't7', name: 'image.generate', description: 'Text-to-image synthesis with style memory.', group: 'Creative', status: 'idle', latencyMs: 8200, callsToday: 19, icon: '🖼️' },
  { id: 't8', name: 'device.control', description: 'IoT commands: lights, locks, thermostat, speakers.', group: 'Automation', status: 'active', latencyMs: 120, callsToday: 508, icon: '💡' },
  { id: 't9', name: 'memory.store / recall', description: 'Persistent tiered memory writes and semantic retrieval.', group: 'Knowledge', status: 'active', latencyMs: 30, callsToday: 7734, icon: '🧠' },
  { id: 't10', name: 'code.run', description: 'Execute snippets in ephemeral sandboxes per language.', group: 'Developer', status: 'active', latencyMs: 400, callsToday: 156, icon: '⚡' },
  { id: 't11', name: 'translate.text', description: '95-language translation with tone preservation.', group: 'Information', status: 'active', latencyMs: 80, callsToday: 64, icon: '🈺' },
  { id: 't12', name: 'sensor.stream', description: 'Live telemetry ingestion from cameras and mics.', group: 'Perception', status: 'error', latencyMs: 0, callsToday: 0, icon: '📡' },
];

// ---------------- Skills ----------------
export const skills: Skill[] = [
  { id: 's1', name: 'Task Planning', description: 'Decompose goals into ordered, verifiable steps.', level: 92, source: 'trained', lastUsed: '2 min ago', icon: '🧩' },
  { id: 's2', name: 'Context Switching', description: 'Juggle parallel threads without losing state.', level: 88, source: 'learned', lastUsed: 'just now', icon: '🔀' },
  { id: 's3', name: 'Summarization', description: 'Distill long documents into key insight layers.', level: 95, source: 'inherited', lastUsed: '5 min ago', icon: '📝' },
  { id: 's4', name: 'Ambiguity Resolution', description: 'Ask the one right clarifying question when needed.', level: 78, source: 'learned', lastUsed: '1 hr ago', icon: '❓' },
  { id: 's5', name: 'Code Generation', description: 'Write, test and refactor production-grade code.', level: 90, source: 'trained', lastUsed: '12 min ago', icon: '💻' },
  { id: 's6', name: 'Emotional Tone', description: 'Match register: calm, urgent, celebratory, discreet.', level: 83, source: 'learned', lastUsed: '3 min ago', icon: '💬' },
  { id: 's7', name: 'Prioritization', description: 'Eisenhower-style triage under conflicting demands.', level: 86, source: 'trained', lastUsed: '20 min ago', icon: '🎯' },
  { id: 's8', name: 'Tool Selection', description: 'Pick minimal sufficient tool chain for a request.', level: 91, source: 'learned', lastUsed: 'just now', icon: '🛠️' },
  { id: 's9', name: 'Safety Judgement', description: 'Detect risky actions and escalate to human approval.', level: 97, source: 'trained', lastUsed: '8 min ago', icon: '🚦' },
];

// ---------------- Connectors ----------------
export const connectors: Connector[] = [
  { id: 'c1', name: 'Gmail', service: 'google', status: 'connected', scopes: ['read', 'send', 'labels'], lastSync: '40s ago', icon: '✉️', color: '#ea4335' },
  { id: 'c2', name: 'Google Calendar', service: 'google', status: 'connected', scopes: ['read', 'write'], lastSync: '1m ago', icon: '📅', color: '#4285f4' },
  { id: 'c3', name: 'GitHub', service: 'dev', status: 'connected', scopes: ['repo', 'pull_request', 'issues'], lastSync: '2m ago', icon: '🐙', color: '#8b5cf6' },
  { id: 'c4', name: 'Slack', service: 'chat', status: 'auth-required', scopes: ['channels:read'], lastSync: '—', icon: '💼', color: '#36c5f0' },
  { id: 'c5', name: 'Notion', service: 'knowledge', status: 'connected', scopes: ['pages', 'databases'], lastSync: '10m ago', icon: '📓', color: '#e5e7eb' },
  { id: 'c6', name: 'Home Assistant', service: 'home', status: 'connected', scopes: ['states', 'services'], lastSync: '5s ago', icon: '🏡', color: '#22c55e' },
  { id: 'c7', name: 'Spotify', service: 'media', status: 'disconnected', scopes: [], lastSync: '—', icon: '🎵', color: '#1db954' },
  { id: 'c8', name: 'Linear', service: 'dev', status: 'available', scopes: [], lastSync: '—', icon: '🌀', color: '#5e6ad2' },
];

// ---------------- Agents ----------------
export const agents: Agent[] = [
  { id: 'a1', name: 'Zoey Prime', role: 'Orchestrator · routes every request, owns the final answer', model: 'zoey-core-xl', status: 'working', tasksDone: 18422, activeTask: 'Coordinating "Trip to Tokyo" workflow', autonomy: 3, icon: '◆' },
  { id: 'a2', name: 'Scout', role: 'Research · web, docs and knowledge-base mining', model: 'zoey-research-m', status: 'working', tasksDone: 9310, activeTask: 'Comparing flight options NRT/HND', autonomy: 2, icon: '🔍' },
  { id: 'a3', name: 'Scribe', role: 'Writing · drafts, edits and formats deliverables', model: 'zoey-writer-m', status: 'standby', tasksDone: 4102, autonomy: 2, icon: '✍️' },
  { id: 'a4', name: 'Warden', role: 'Security · monitors anomalies, guards approvals', model: 'zoey-guard-s', status: 'active', tasksDone: 27650, autonomy: 1, icon: '🛡️' },
  { id: 'a5', name: 'Artisan', role: 'Creative · images, layouts, media composition', model: 'zoey-diff-l', status: 'paused', tasksDone: 890, autonomy: 2, icon: '🎨' },
  { id: 'a6', name: 'Operator', role: 'Execution · shell, browser and device actions', model: 'zoey-act-s', status: 'working', tasksDone: 15230, activeTask: 'Booking conference room Fri 14:00', autonomy: 1, icon: '⚙️' },
];

// ---------------- Workflows ----------------
export const workflows: Workflow[] = [
  {
    id: 'w1', name: 'Morning Briefing', description: 'At 07:00 compile weather, calendar deltas, urgent mail and news into a 90-second audio digest.',
    status: 'running', runsToday: 1, successRate: 99.2, lastRun: '07:00 today',
    nodes: [
      { id: 'n1', label: 'Cron 07:00', kind: 'trigger', x: 40, y: 90 },
      { id: 'n2', label: 'Scout: gather', kind: 'agent', x: 240, y: 30 },
      { id: 'n3', label: 'Calendar diff', kind: 'action', x: 240, y: 150 },
      { id: 'n4', label: 'Urgent?', kind: 'condition', x: 450, y: 90 },
      { id: 'n5', label: 'Speak digest', kind: 'output', x: 660, y: 40 },
      { id: 'n6', label: 'Ping priority item', kind: 'output', x: 660, y: 150 },
    ],
    edges: [{ from: 'n1', to: 'n2' }, { from: 'n1', to: 'n3' }, { from: 'n2', to: 'n4' }, { from: 'n3', to: 'n4' }, { from: 'n4', to: 'n5' }, { from: 'n4', to: 'n6' }],
  },
  {
    id: 'w2', name: 'Inbox Triage', description: 'Every 15 min classify incoming mail → draft replies for A-tier, archive noise, escalate VIPs.',
    status: 'running', runsToday: 47, successRate: 96.8, lastRun: '6 min ago',
    nodes: [
      { id: 'm1', label: 'New email', kind: 'trigger', x: 40, y: 90 },
      { id: 'm2', label: 'Classify tier', kind: 'agent', x: 250, y: 90 },
      { id: 'm3', label: 'VIP?', kind: 'condition', x: 460, y: 90 },
      { id: 'm4', label: 'Draft reply', kind: 'action', x: 670, y: 30 },
      { id: 'm5', label: 'Notify instantly', kind: 'output', x: 670, y: 150 },
    ],
    edges: [{ from: 'm1', to: 'm2' }, { from: 'm2', to: 'm3' }, { from: 'm3', to: 'm4' }, { from: 'm3', to: 'm5' }],
  },
  {
    id: 'w3', name: 'Security Sweep', description: 'Nightly scan of logins, ports and device firmware; auto-isolate anything anomalous.',
    status: 'paused', runsToday: 0, successRate: 100, lastRun: 'Yesterday 03:00',
    nodes: [
      { id: 'k1', label: 'Cron 03:00', kind: 'trigger', x: 40, y: 90 },
      { id: 'k2', label: 'Warden audit', kind: 'agent', x: 260, y: 90 },
      { id: 'k3', label: 'Anomaly?', kind: 'condition', x: 480, y: 90 },
      { id: 'k4', label: 'Isolate + alert', kind: 'output', x: 690, y: 30 },
      { id: 'k5', label: 'Log clean report', kind: 'output', x: 690, y: 150 },
    ],
    edges: [{ from: 'k1', to: 'k2' }, { from: 'k2', to: 'k3' }, { from: 'k3', to: 'k4' }, { from: 'k3', to: 'k5' }],
  },
  {
    id: 'w4', name: 'Trip Planner', description: 'Natural-language goal → flights, hotel, itinerary, calendar blocks and packing list.',
    status: 'draft', runsToday: 3, successRate: 91.0, lastRun: '12 min ago',
    nodes: [
      { id: 'r1', label: 'Goal: "Trip to Tokyo"', kind: 'trigger', x: 40, y: 90 },
      { id: 'r2', label: 'Scout: options', kind: 'agent', x: 250, y: 30 },
      { id: 'r3', label: 'Budget check', kind: 'condition', x: 250, y: 150 },
      { id: 'r4', label: 'Confirm w/ user', kind: 'action', x: 470, y: 90 },
      { id: 'r5', label: 'Book + calendar', kind: 'output', x: 680, y: 90 },
    ],
    edges: [{ from: 'r1', to: 'r2' }, { from: 'r1', to: 'r3' }, { from: 'r2', to: 'r4' }, { from: 'r3', to: 'r4' }, { from: 'r4', to: 'r5' }],
  },
];

// ---------------- Integrations ----------------
export const integrations: Integration[] = [
  { id: 'i1', name: 'OpenAI / Anthropic APIs', category: 'Model Backends', status: 'linked', features: ['fallback routing', 'cost caps'], icon: '🤖' },
  { id: 'i2', name: 'VS Code Companion', category: 'Developer', status: 'linked', features: ['inline assist', 'agent mode'], icon: '🧑‍💻' },
  { id: 'i3', name: 'Android / iOS Bridge', category: 'Devices', status: 'linked', features: ['notifications relay', 'find phone'], icon: '📱' },
  { id: 'i4', name: 'Zigbee / Matter Mesh', category: 'Home', status: 'linked', features: ['local control', 'no cloud'], icon: '🔗' },
  { id: 'i5', name: 'Obsidian Vault', category: 'Knowledge', status: 'available', features: ['semantic index'], icon: '💎' },
  { id: 'i6', name: 'Stripe Dashboard', category: 'Finance', status: 'available', features: ['spend alerts'], icon: '💳' },
];

// ---------------- Activity feed ----------------
export const activityFeed = [
  { t: '22:41:07', who: 'Zoey Prime', what: 'Delegated flight comparison to Scout', tone: 'info' },
  { t: '22:40:52', who: 'Warden', what: 'Blocked suspicious login attempt (Kyiv) — account locked', tone: 'warn' },
  { t: '22:39:18', who: 'Operator', what: 'booked Room Aurora · Fri 14:00 · invite sent to 4 people', tone: 'ok' },
  { t: '22:36:44', who: 'Zoey Prime', what: 'Stored preference: aisle seat, no shellfish in long-term memory', tone: 'mem' },
  { t: '22:31:02', who: 'Scribe', what: 'Drafted Q3 update email — awaiting your approval', tone: 'pending' },
  { t: '22:24:37', who: 'Scout', what: 'Researched 14 sources for Tokyo itinerary shortlist', tone: 'info' },
  { t: '22:18:55', who: 'Home Hub', what: 'Evening scene: lights 40%, 22°C, jazz playlist', tone: 'ok' },
];
