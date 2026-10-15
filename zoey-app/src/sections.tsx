import { useMemo, useState } from 'react';
import { plugins, tools, skills, connectors, agents, workflows, integrations, activityFeed } from './data';
import type { Workflow, WorkflowNode } from './data';

/* ================= helpers ================= */
export function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <div className="section-head">
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
      <p>{sub}</p>
    </div>
  );
}

export function Stats({ items }: { items: { num: string | number; lbl: string }[] }) {
  return (
    <div className="stats">
      {items.map((s) => (
        <div className="stat" key={s.lbl}>
          <div className="num">{s.num}</div>
          <div className="lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  );
}

/* ================= OVERVIEW / HUD ================= */
const heroLines = [
  'Good evening. Three agents are active, two workflows are running.',
  'I blocked a suspicious login and drafted your Q3 update.',
  'Say the word — or type below — and I will handle the rest.',
];

export function Overview() {
  const [li, setLi] = useState(0);
  // simple rotating "briefing" line
  useMemo(() => {
    const id = setInterval(() => setLi((v) => (v + 1) % heroLines.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="hero">
        <div className="radar" />
        <div className="kicker" style={{ color: 'var(--cyan)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700 }}>
          ZOEy OS · Personal Intelligence Layer
        </div>
        <h1>
          I am <em>Zoey</em>. Your systems, scheduled, guarded<br />and thought through — <em>autonomously</em>.
        </h1>
        <p className="typing">{heroLines[li]}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn primary">⌘ Command Zoey</button>
          <button className="btn">Run Morning Briefing</button>
          <button className="btn">Security Status</button>
        </div>
      </div>

      <Stats
        items={[
          { num: agents.filter((a) => a.status === 'working' || a.status === 'active').length, lbl: 'Agents Online' },
          { num: workflows.filter((w) => w.status === 'running').length, lbl: 'Workflows Running' },
          { num: plugins.filter((p) => p.status === 'installed').length, lbl: 'Plugins Installed' },
          { num: connectors.filter((c) => c.status === 'connected').length, lbl: 'Connectors Linked' },
          { num: tools.reduce((a, t) => a + t.callsToday, 0).toLocaleString(), lbl: 'Tool Calls Today' },
          { num: '99.4%', lbl: 'Uptime 30d' },
        ]}
      />

      <SectionHead kicker="Live pulse" title="System at a glance" sub="Everything Zoey is doing right now, streamed from the orchestrator event bus." />
      <div className="grid cols-2">
        {agents
          .filter((a) => a.activeTask)
          .map((a) => (
            <div className="card" key={a.id}>
              <h3><span>{a.icon}</span> {a.name} <span className="badge info">{a.status}</span></h3>
              <div className="desc">{a.activeTask}</div>
              <span className="chip">{a.model}</span>
            </div>
          ))}
        <div className="card">
          <h3><span>🛡️</span> Warden Report</h3>
          <div className="desc">No open threats. Last incident auto-resolved 41 min ago. Approval queue: 1 draft email awaiting you.</div>
          <span className="badge ok">All clear</span>
        </div>
      </div>
    </>
  );
}

/* ================= PLUGINS ================= */
export function Plugins() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const cats = ['All', ...Array.from(new Set(plugins.map((p) => p.category)))];
  const list = plugins.filter(
    (p) => (cat === 'All' || p.category === cat) && (p.name + p.description).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <SectionHead kicker="Control Plane" title="Plugins" sub="Capability packs that extend Zoey's senses and limbs. Each plugin declares permissions up front — nothing runs without your grant." />
      <Stats items={[
        { num: plugins.filter((p) => p.status === 'installed').length, lbl: 'Installed' },
        { num: plugins.filter((p) => p.status === 'update').length, lbl: 'Updates Ready' },
        { num: plugins.filter((p) => p.status === 'available').length, lbl: 'In Marketplace' },
      ]} />
      <div className="toolbar">
        <input className="search" placeholder="Search plugins…" value={q} onChange={(e) => setQ(e.target.value)} />
        {cats.map((c) => (
          <button key={c} className={`filter-btn ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <div className="grid cols-2">
        {list.map((p) => (
          <div className="card" key={p.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <span className="icon-lg">{p.icon}</span>
              {p.status === 'installed' && <span className="badge ok">installed</span>}
              {p.status === 'update' && <span className="badge warn">update</span>}
              {p.status === 'available' && <span className="badge dim">available</span>}
            </div>
            <h3>{p.name}</h3>
            <div className="desc">{p.description}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              <span className="chip">v{p.version}</span>
              <span className="chip">{p.category}</span>
              {p.permissions.map((perm) => <span className="chip" key={perm}>🔑 {perm}</span>)}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {p.status === 'installed' && <button className="btn danger">Disable</button>}
              {p.status === 'update' && <button className="btn primary">Update now</button>}
              {p.status === 'available' && <button className="btn primary">Install</button>}
              <button className="btn">Configure</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= TOOLS ================= */
export function Tools() {
  const [group, setGroup] = useState('All');
  const groups = ['All', ...Array.from(new Set(tools.map((t) => t.group)))];
  const list = tools.filter((t) => group === 'All' || t.group === group);

  return (
    <>
      <SectionHead kicker="Execution Fabric" title="Tools" sub="The atomic actions Zoey can take on your world. Every call is logged, rate-limited and sandboxed; high-risk tools require approval." />
      <div className="toolbar">
        {groups.map((g) => (
          <button key={g} className={`filter-btn ${group === g ? 'active' : ''}`} onClick={() => setGroup(g)}>{g}</button>
        ))}
      </div>
      <div className="grid cols-3">
        {list.map((t) => (
          <div className="card" key={t.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3><span>{t.icon}</span> <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{t.name}</span></h3>
              {t.status === 'active' && <span className="badge ok">active</span>}
              {t.status === 'idle' && <span className="badge dim">idle</span>}
              {t.status === 'error' && <span className="badge err">error</span>}
            </div>
            <div className="desc">{t.description}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="chip">{t.latencyMs > 0 ? `~${t.latencyMs}ms` : '—'}</span>
              <span className="chip">{t.callsToday.toLocaleString()} calls today</span>
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <label className="switch">
                <input type="checkbox" defaultChecked={t.status !== 'error'} disabled={t.status === 'error'} />
                <span className="slider" />
              </label>
              <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>enabled for agents</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= SKILLS ================= */
export function Skills() {
  return (
    <>
      <SectionHead kicker="Competency Matrix" title="Skills" sub="Learned proficiencies that improve with use. Zoey self-evaluates after every task and updates these levels continuously." />
      <Stats items={[
        { num: Math.round(skills.reduce((a, s) => a + s.level, 0) / skills.length) + '%', lbl: 'Avg Proficiency' },
        { num: skills.filter((s) => s.source === 'learned').length, lbl: 'Self-Learned' },
        { num: skills.filter((s) => s.level >= 90).length, lbl: 'Expert (≥90)' },
      ]} />
      <div className="grid cols-2">
        {skills.map((s) => (
          <div className="card" key={s.id}>
            <h3><span>{s.icon}</span> {s.name}
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', color: 'var(--mint)', fontSize: 13 }}>{s.level}</span>
            </h3>
            <div className="desc">{s.description}</div>
            <div className="bar"><i style={{ width: `${s.level}%` }} /></div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              <span className={s.source === 'learned' ? 'badge violet' : s.source === 'trained' ? 'badge info' : 'badge dim'}>{s.source}</span>
              <span className="chip">last used {s.lastUsed}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= CONNECTORS ================= */
export function Connectors() {
  return (
    <>
      <SectionHead kicker="Data Bridges" title="Connectors" sub="OAuth & local bridges to the services your life runs on. Scopes are least-privilege and revocable per connector." />
      <div className="grid cols-2">
        {connectors.map((c) => (
          <div className="card" key={c.id} style={{ borderLeft: `3px solid ${c.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3><span>{c.icon}</span> {c.name}</h3>
              {c.status === 'connected' && <span className="badge ok">connected</span>}
              {c.status === 'auth-required' && <span className="badge warn">auth required</span>}
              {c.status === 'disconnected' && <span className="badge err">disconnected</span>}
              {c.status === 'available' && <span className="badge dim">not linked</span>}
            </div>
            <div className="desc" style={{ margin: '8px 0' }}>
              {c.scopes.length ? (
                <>Granted scopes:{' '}
                  {c.scopes.map((sc) => <span className="chip" key={sc} style={{ marginRight: 4 }}>{sc}</span>)}
                </>
              ) : 'No access granted yet.'}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {(c.status === 'available' || c.status === 'disconnected') && <button className="btn primary">Link account</button>}
              {c.status === 'auth-required' && <button className="btn primary">Re-authorize</button>}
              {c.status === 'connected' && <button className="btn">Adjust scopes</button>}
              {c.status === 'connected' && <button className="btn danger">Revoke</button>}
              <span className="chip" style={{ marginLeft: 'auto' }}>sync: {c.lastSync}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= AGENTS ================= */
export function Agents() {
  return (
    <>
      <SectionHead kicker="Swarm" title="Agents" sub="Specialist sub-agents orchestrated by Zoey Prime. Autonomy level controls how far they act before asking you." />
      <Stats items={[
        { num: agents.length, lbl: 'Agents Defined' },
        { num: agents.filter((a) => a.status === 'working').length, lbl: 'Actively Working' },
        { num: agents.reduce((a, x) => a + x.tasksDone, 0).toLocaleString(), lbl: 'Lifetime Tasks' },
      ]} />
      <div className="grid cols-2">
        {agents.map((a) => (
          <div className="card" key={a.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3><span style={{ color: 'var(--cyan)' }}>{a.icon}</span> {a.name}</h3>
              <span className={`badge ${a.status === 'working' ? 'info' : a.status === 'active' ? 'ok' : a.status === 'standby' ? 'dim' : 'warn'}`}>{a.status}</span>
            </div>
            <div className="desc">{a.role}</div>
            {a.activeTask && (
              <div style={{ fontSize: 12, color: 'var(--mint)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
                ▶ {a.activeTask}
              </div>
            )}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
              <span className="chip">{a.model}</span>
              <span className="chip">{a.tasksDone.toLocaleString()} tasks</span>
              <span style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 4 }}>autonomy</span>
              {[0, 1, 2, 3].map((n) => (
                <span key={n} style={{
                  width: 14, height: 6, borderRadius: 3,
                  background: n < a.autonomy ? 'var(--cyan)' : 'rgba(94,234,212,.15)',
                  boxShadow: n < a.autonomy ? '0 0 6px var(--cyan)' : 'none',
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn">Assign task</button>
              <button className="btn">Logs</button>
              {a.status !== 'paused' ? <button className="btn danger">Pause</button> : <button className="btn primary">Resume</button>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= WORKFLOWS ================= */
function WfDiagram({ wf }: { wf: Workflow }) {
  const pos = useMemo(() => {
    const xs = wf.nodes.map((n) => n.x), ys = wf.nodes.map((n) => n.y);
    const maxX = Math.max(...xs) + 160, maxY = Math.max(...ys) + 90;
    return (n: WorkflowNode) => ({ left: `${(n.x / maxX) * 100}%`, top: `${(n.y / maxY) * 100}%` });
  }, [wf]);

  return (
    <div className="wf-canvas">
      <svg className="wf-svg" preserveAspectRatio="none" viewBox={`0 0 ${Math.max(...wf.nodes.map((n) => n.x)) + 160} ${Math.max(...wf.nodes.map((n) => n.y)) + 90}`}>
        {wf.edges.map((e, i) => {
          const a = wf.nodes.find((n) => n.id === e.from)!;
          const b = wf.nodes.find((n) => n.id === e.to)!;
          return <path key={i} className="wf-line" d={`M ${a.x + 55} ${a.y + 45} C ${(a.x + b.x) / 2 + 55} ${a.y + 45}, ${(a.x + b.x) / 2 + 55} ${b.y + 45}, ${b.x + 45} ${b.y + 45}`} />;
        })}
      </svg>
      {wf.nodes.map((n) => (
        <div key={n.id} className={`wf-node ${n.kind}`} style={pos(n)}>{n.label}</div>
      ))}
    </div>
  );
}

export function Workflows() {
  const [sel, setSel] = useState(workflows[0].id);
  const wf = workflows.find((w) => w.id === sel)!;

  return (
    <>
      <SectionHead kicker="Automation Graphs" title="Workflows" sub="Multi-step routines chaining triggers, agents, conditions and outputs. Select a workflow to inspect its live graph." />
      <div className="toolbar">
        {workflows.map((w) => (
          <button key={w.id} className={`filter-btn ${sel === w.id ? 'active' : ''}`} onClick={() => setSel(w.id)}>
            {w.name} · {w.status}
          </button>
        ))}
        <button className="btn primary" style={{ marginLeft: 'auto' }}>+ New workflow</button>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <h3>{wf.name}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className={`badge ${wf.status === 'running' ? 'ok' : wf.status === 'paused' ? 'warn' : 'dim'}`}>{wf.status}</span>
            <span className="chip">{wf.runsToday} runs today</span>
            <span className="chip">{wf.successRate}% success</span>
            <span className="chip">last: {wf.lastRun}</span>
          </div>
        </div>
        <div className="desc">{wf.description}</div>
        <WfDiagram wf={wf} />
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {wf.status === 'running' ? <button className="btn danger">Pause</button> : <button className="btn primary">Activate</button>}
          <button className="btn">Run once now</button>
          <button className="btn">Edit graph</button>
          <button className="btn">History</button>
        </div>
      </div>
      <div className="grid cols-3">
        <div className="card"><h3><span>⏱</span> Triggers</h3><div className="desc">Cron, events (new mail, sensor state), natural-language goals, or chained from other workflows.</div></div>
        <div className="card"><h3><span>🧠</span> Reasoning nodes</h3><div className="desc">Each step may invoke an agent with scoped tool access and a hard token budget.</div></div>
        <div className="card"><h3><span>✋</span> Human gates</h3><div className="desc">Any node can require approval — spend, sends and deletions pause until you confirm.</div></div>
      </div>
    </>
  );
}

/* ================= INTEGRATIONS ================= */
export function Integrations() {
  return (
    <>
      <SectionHead kicker="Ecosystem" title="Integrations" sub="Deeper platform ties beyond single accounts — SDK backends, editor companions and device meshes." />
      <div className="grid cols-3">
        {integrations.map((i) => (
          <div className="card" key={i.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3><span>{i.icon}</span> {i.name}</h3>
              {i.status === 'linked' ? <span className="badge ok">linked</span> : <span className="badge dim">available</span>}
            </div>
            <div className="desc">{i.category}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {i.features.map((f) => <span className="chip" key={f}>{f}</span>)}
            </div>
            <button className={i.status === 'linked' ? 'btn' : 'btn primary'}>{i.status === 'linked' ? 'Manage' : 'Connect'}</button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ================= Activity feed (right rail) ================= */
export function ActivityRail({ extra }: { extra: { t: string; who: string; what: string; tone: string }[] }) {
  const all = [...extra, ...activityFeed].slice(0, 14);
  return (
    <>
      {all.map((f, i) => (
        <div className={`feed-item ${f.tone}`} key={`${f.t}-${i}`}>
          <div className="t">{f.t}</div>
          <div><span className="who">{f.who}</span> — {f.what}</div>
        </div>
      ))}
    </>
  );
}
