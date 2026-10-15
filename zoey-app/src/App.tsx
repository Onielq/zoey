import { useEffect, useRef, useState } from 'react';
import {
  Overview, Plugins, Tools, Skills, Connectors, Agents, Workflows, Integrations, ActivityRail,
} from './sections';

const SECTIONS = [
  { id: 'overview', label: 'Overview', el: <Overview /> },
  { id: 'plugins', label: 'Plugins', el: <Plugins /> },
  { id: 'integrations', label: 'Integrations', el: <Integrations /> },
  { id: 'tools', label: 'Tools', el: <Tools /> },
  { id: 'skills', label: 'Skills', el: <Skills /> },
  { id: 'connectors', label: 'Connectors', el: <Connectors /> },
  { id: 'agents', label: 'Agents', el: <Agents /> },
  { id: 'workflows', label: 'Workflows', el: <Workflows /> },
] as const;

/* ---------- animated particle background ---------- */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    let raf = 0;
    const N = 70;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0009, vy: (Math.random() - 0.5) * 0.0009,
    }));
    const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
    resize(); addEventListener('resize', resize);
    const tick = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      }
      // links
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = (pts[i].x - pts[j].x) * cv.width, dy = (pts[i].y - pts[j].y) * cv.height;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.strokeStyle = `rgba(94,234,212,${0.10 * (1 - d / 130)})`;
          ctx.beginPath(); ctx.moveTo(pts[i].x * cv.width, pts[i].y * cv.height);
          ctx.lineTo(pts[j].x * cv.width, pts[j].y * cv.height); ctx.stroke();
        }
      }
      // dots
      for (const p of pts) {
        ctx.fillStyle = 'rgba(34,211,238,0.55)';
        ctx.beginPath(); ctx.arc(p.x * cv.width, p.y * cv.height, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); };
  }, []);
  return <canvas id="particles" ref={ref} />;
}

/* ---------- clock ---------- */
function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return <span className="clock">{now.toLocaleTimeString([], { hour12: false })}</span>;
}

/* ---------- command dock (simulated Zoey responses) ---------- */
interface FeedItem { t: string; who: string; what: string; tone: string }

function respond(input: string): FeedItem {
  const now = new Date().toLocaleTimeString([], { hour12: false });
  const low = input.toLowerCase();
  if (low.includes('weather')) return { t: now, who: 'Scout', what: `"${input}" → 18°C, clear skies tomorrow; umbrella not needed`, tone: 'info' };
  if (low.includes('email') || low.includes('send')) return { t: now, who: 'Scribe', what: `Draft ready for "${input}" — awaiting your approval before sending`, tone: 'pending' };
  if (low.includes('book') || low.includes('calendar') || low.includes('meet')) return { t: now, who: 'Operator', what: `Reserved slot & created event for "${input}"`, tone: 'ok' };
  if (low.includes('light') || low.includes('home') || low.includes('lock')) return { t: now, who: 'Home Hub', what: `Device action executed: "${input}"`, tone: 'ok' };
  if (low.includes('secur') || low.includes('threat') || low.includes('scan')) return { t: now, who: 'Warden', what: `Running security sweep for "${input}" — baseline clean so far`, tone: 'warn' };
  if (low.includes('remember') || low.includes('prefer')) return { t: now, who: 'Zoey Prime', what: `Stored in long-term memory: "${input}"`, tone: 'mem' };
  return { t: now, who: 'Zoey Prime', what: `Understood — routed "${input}" to the best agent; progress below`, tone: 'info' };
}

export default function App() {
  const [active, setActive] = useState<string>('overview');
  const [extraFeed, setExtraFeed] = useState<FeedItem[]>([]);
  const [cmd, setCmd] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmd.trim()) return;
    setExtraFeed((f) => [respond(cmd), ...f].slice(0, 8));
    setCmd('');
  };

  const section = SECTIONS.find((s) => s.id === active)!;

  return (
    <>
      <Particles />
      <div className="shell">
        <header className="topbar">
          <div className="brand">
            <div className="core" />
            <div>
              <div className="brand-name">ZOEY</div>
              <div className="brand-sub">OS · Jarvis-class</div>
            </div>
          </div>
          <nav className="nav">
            {SECTIONS.map((s) => (
              <button key={s.id} className={active === s.id ? 'active' : ''} onClick={() => setActive(s.id)}>
                {s.label}
              </button>
            ))}
          </nav>
          <div className="status-cluster">
            <span><span className="dot on" /> core online</span>
            <Clock />
          </div>
        </header>

        <div className="body-grid">
          <main className="main">{section.el}</main>
          <aside className="rail">
            <h4>Live activity</h4>
            <div className="feed">
              <ActivityRail extra={extraFeed} />
            </div>
            <form className="cmd-dock" onSubmit={submit}>
              <input
                className="cmd-input"
                placeholder='Command Zoey… e.g. "book a room Friday"'
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
              />
              <div className="cmd-hint">ENTER to send · everything is logged</div>
            </form>
          </aside>
        </div>
      </div>
    </>
  );
}
