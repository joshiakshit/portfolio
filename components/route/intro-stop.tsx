import { SchematicCard, StopHeader } from '@/components/ui/primitives';
import { INTRO_PILLS } from '@/lib/site-data';

const TOPOLOGY_BOXES = [
  { x: 16, label: 'CLIENT / CLI', sub: 'TLS 1.3 · mTLS', accent: false },
  { x: 142, label: 'CORE GATEWAY', sub: 'FastAPI · JWT', accent: true },
  { x: 268, label: 'STATE ENGINE', sub: 'Redis · Postgres', accent: false },
];

export function IntroStop() {
  return (
    <section id="stop-1" className="stop stop-intro" aria-labelledby="intro-title">
      <div className="anchor" data-stop="intro">
        <SchematicCard
          leftLabel="sys.topology // node_01"
          rightLabel="status: online"
          viewBox="0 0 380 230"
          className="intro-schematic"
        >
          {TOPOLOGY_BOXES.map(({ x, label, sub, accent }) => (
            <g key={label}>
              <rect
                x={x}
                y="20"
                width="96"
                height="52"
                rx="6"
                className={accent ? 'sch-box sch-box-accent' : 'sch-box'}
              />
              <text x={x + 48} y="43" textAnchor="middle" className="sch-label">
                {label}
              </text>
              <text x={x + 48} y="59" textAnchor="middle" className="sch-sub">
                {sub}
              </text>
            </g>
          ))}

          <path d="M112 46h30M238 46h30" className="sch-wire" />
          <circle cx="127" cy="46" r="2.5" className="sch-dot" />
          <circle cx="253" cy="46" r="2.5" className="sch-dot" />

          <path d="M190 72v44" className="sch-wire sch-wire-dashed" />
          <rect x="74" y="116" width="232" height="86" rx="8" className="sch-box" />
          <text x="92" y="138" className="sch-sub">
            TELEMETRY &amp; SPECTRUM BUS
          </text>
          <path
            d="M92 174 Q 116 144, 140 174 T 188 174 T 236 174 T 284 174"
            className="sch-wave"
          />
          <text x="92" y="192" className="sch-mono">
            0x7F · packets verified · latency 1.4ms
          </text>
        </SchematicCard>
      </div>

      <div className="txt">
        <StopHeader
          tag="01  ·  INTRO"
          title="Akshit Joshi"
          titleId="intro-title"
          headingAs="h1"
          lead="Backend Engineer + Cybersecurity hobbyist"
          body="Building systems that people will actually use and dabbling into cybersec. Low-level mechanics, service architecture, and network protocols."
        />
        <div className="intro-meta-pills">
          {INTRO_PILLS.map((pill) => (
            <span key={pill} className="meta-pill">
              {pill}
            </span>
          ))}
        </div>
        <div id="scroll-hint" className="scroll-hint" aria-hidden="true">
          ↓ scroll to trace the line
        </div>
      </div>
    </section>
  );
}
