'use client';

import { useState } from 'react';
import { ProgressRing, SketchFrame } from '@/components/sketches/sketch-frame';
import type { FeaturedProject } from '@/lib/project-catalog';

const AUTH_NODES = [
  { x: 44, label: 'client' },
  { x: 161, label: 'auth' },
  { x: 278, label: 'redis' },
];

export function AuthSketch() {
  const [token, setToken] = useState<number | null>(108);
  const unlocked = token !== null;

  return (
    <SketchFrame
      title="token verification primitive"
      ariaLabel="Interactive JWT Lock Schematic"
      readout={
        unlocked
          ? `SESSION-${token} · asymmetric JWT verified (TTL 900s)`
          : 'REVOKED · token blacklisted in Redis (0ms propagation)'
      }
      actions={[
        {
          label: unlocked ? 'rotate token ↻' : 'issue token →',
          onClick: () => setToken((prev) => (((prev ?? 100) + 37) % 900) + 100),
        },
        { label: 'revoke ×', onClick: () => setToken(null), disabled: !unlocked },
      ]}
    >
      <circle cx="190" cy="86" r="56" className="doodle-orbit" />
      <path
        d={unlocked ? 'M166 78V56a24 24 0 0 1 48 0' : 'M166 78V56a24 24 0 0 1 48 0v22'}
        className={`lock-shackle ${unlocked ? 'is-unlocked' : ''}`}
      />
      <rect x="150" y="77" width="80" height="56" rx="8" className="doodle-surface" />
      <path
        d="M175 105l10 10 22-24"
        className="auth-check"
        style={{ opacity: unlocked ? 1 : 0.18 }}
      />
      <path d="M46 174h288" className="doodle-guide" />
      {AUTH_NODES.map(({ x, label }) => (
        <g key={label} transform={`translate(${x}, 160)`}>
          <rect width="58" height="26" rx="4" className="doodle-surface" />
          <text x="29" y="17" textAnchor="middle" className="doodle-small">
            {label}
          </text>
        </g>
      ))}
    </SketchFrame>
  );
}

const BAND_ORDER = [3, 5, 1, 7, 6, 2, 4, 0];

export function WarfareSketch() {
  const [step, setStep] = useState(0);
  const [bars, setBars] = useState([40, 100, 60, 126, 50, 110, 72, 86]);

  const bandIdx = BAND_ORDER[step % BAND_ORDER.length];
  const mode = step % 3 === 0 ? 'ε-explore' : 'exploit';
  const snr = (bars[bandIdx] * 0.16).toFixed(1);

  return (
    <SketchFrame
      title="1 receiver · 8 frequency bands"
      ariaLabel="Frequency Spectrum Scanner"
      readout={`observing band 0${bandIdx + 1} · SNR +${snr} dB (${mode})`}
      actions={[
        { label: 'scan next band →', onClick: () => setStep((s) => s + 1) },
        {
          label: 'shuffle spectrum ↻',
          onClick: () => {
            setBars(bars.map((_, i) => 34 + ((i * 29 + step * 43 + 61) % 98)));
            setStep((s) => s + 1);
          },
        },
      ]}
    >
      <path d="M34 36h312M34 76h312M34 116h312M34 156h312" className="doodle-guide" />
      <path d="M34 24v144h312" className="doodle-axis" />
      <g>
        {bars.map((h, i) => (
          <rect
            key={i}
            x={46 + i * 38}
            y={168 - h}
            width="22"
            height={h}
            rx="2"
            className={`spectrum-bar ${i === bandIdx ? 'is-active' : ''}`}
          />
        ))}
      </g>
      <rect
        x={41 + bandIdx * 38}
        y="28"
        width="32"
        height="140"
        rx="3"
        className="receiver-window"
      />
      <text x="190" y="194" textAnchor="middle" className="doodle-small">
        BANDS 01 — 08 (MULTI-ARMED BANDIT POLICY)
      </text>
    </SketchFrame>
  );
}

export function AxisSketch() {
  const [state, setState] = useState({ attended: 14, total: 17 });
  const pct = Math.round((state.attended / state.total) * 100);
  const canSkip = Math.floor(state.attended / 0.75 - state.total);
  const needed = Math.ceil((0.75 * state.total - state.attended) / 0.25);

  const statusText =
    canSkip > 0
      ? `safe buffer · can skip ${canSkip} lecture${canSkip > 1 ? 's' : ''} and stay >= 75%`
      : pct < 75
        ? `below 75% · need ${needed} consecutive class${needed > 1 ? 'es' : ''} to recover`
        : 'on the edge · attend next lecture to build buffer';

  return (
    <SketchFrame
      title="attendance margin calculator"
      ariaLabel="Axis Mobile Attendance Ring"
      readout={statusText}
      actions={[
        {
          label: '+ attend class',
          onClick: () => setState((s) => ({ attended: s.attended + 1, total: s.total + 1 })),
        },
        {
          label: 'skip class −',
          onClick: () => setState((s) => ({ attended: s.attended, total: s.total + 1 })),
        },
      ]}
    >
      <rect x="115" y="10" width="150" height="190" rx="18" className="doodle-surface" />
      <rect x="165" y="18" width="50" height="4" rx="2" className="doodle-guide" />
      <ProgressRing cx={190} cy={96} r={42} pct={pct} />
      <text x="190" y="94" textAnchor="middle" className="doodle-big">
        {pct}%
      </text>
      <text x="190" y="110" textAnchor="middle" className="doodle-small">
        {state.attended} / {state.total} classes
      </text>
      <path d="M140 162h100M152 174h76" className="doodle-guide" />
    </SketchFrame>
  );
}

const WAVE_SPANS = [25, 40, 18, 52, 30, 46, 20, 56, 32, 42, 22, 50, 34, 26, 15];

export function MusicSketch() {
  const [beatCursor, setBeatCursor] = useState(0);
  const [steps, setSteps] = useState([true, false, true, true, false, true, false, true]);

  return (
    <SketchFrame
      title="voice packet rhythm buffer"
      ariaLabel="Audio Waveform and Step Sequencer"
      readout={`step 0${(beatCursor % 8) + 1}/08 · 120 BPM · 64kbps Opus frame lock`}
      actions={[
        { label: 'step beat →', onClick: () => setBeatCursor((c) => (c + 1) % 8) },
        {
          label: 'invert pattern ↻',
          onClick: () => setSteps((prev) => prev.map((b) => !b)),
        },
      ]}
    >
      <path d="M30 140h320" className="doodle-guide" />
      <g>
        {WAVE_SPANS.map((baseSpan, i) => {
          const span = 16 + ((baseSpan + beatCursor * 13 + i * 7) % 44);
          return (
            <line
              key={i}
              x1={48 + i * 20}
              y1={90 - span}
              x2={48 + i * 20}
              y2={90 + span}
              className={`wave-bar ${i % 4 === beatCursor % 4 ? 'is-active' : ''}`}
            />
          );
        })}
      </g>
      <g transform="translate(42, 154)">
        {steps.map((on, idx) => (
          <rect
            key={idx}
            x={idx * 38}
            y="0"
            width="32"
            height="24"
            rx="4"
            className={`step-box ${on ? 'is-on' : ''}`}
            onClick={() => setSteps((prev) => prev.map((v, i) => (i === idx ? !v : v)))}
          />
        ))}
      </g>
    </SketchFrame>
  );
}

const PROMPTS: [string, string][] = [
  ['Explain the internet', 'to a medieval blacksmith.'],
  ['Defend your most', 'unpopular systems opinion.'],
  ['What would you build', 'with an extra day a week?'],
  ['Explain public-key crypto', 'without using math words.'],
  ['Describe a bug that', 'taught you the most.'],
];

export function ImpromptuSketch() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [line1, line2] = PROMPTS[promptIdx];

  return (
    <SketchFrame
      title="30-second speaking drill"
      ariaLabel="Impromptu Prompt Card and Timer"
      readout={
        secondsLeft === 0
          ? 'time up · audio blob saved locally on-device'
          : `local buffer ready · ${secondsLeft}s remaining on the clock`
      }
      actions={[
        {
          label: 'another topic ↻',
          onClick: () => {
            setPromptIdx((i) => (i + 1) % PROMPTS.length);
            setSecondsLeft(30);
          },
        },
        {
          label: 'countdown −5s',
          onClick: () => setSecondsLeft((s) => (s <= 5 ? 30 : s - 5)),
        },
      ]}
    >
      <rect x="28" y="28" width="210" height="148" rx="8" className="doodle-surface" />
      <circle cx="133" cy="42" r="4" className="sch-dot" />
      <text x="46" y="68" className="doodle-small">
        PROMPT // NO PREP
      </text>
      <text x="46" y="102" className="doodle-prompt">
        {line1}
      </text>
      <text x="46" y="124" className="doodle-prompt">
        {line2}
      </text>
      <path d="M46 150 Q 110 142, 200 150" className="doodle-guide" />
      <ProgressRing cx={304} cy={102} r={44} pct={Math.round((secondsLeft / 30) * 100)} />
      <text x="304" y="108" textAnchor="middle" className="doodle-big">
        {secondsLeft}s
      </text>
    </SketchFrame>
  );
}

export function PokerSketch() {
  const [pot, setPot] = useState(40);

  return (
    <SketchFrame
      title="table pot & stack ledger"
      ariaLabel="Poker Cards and Chip Stack"
      readout={`current pot: ${pot} chips · blinds 5 / 10`}
      actions={[
        { label: '+20 raise pot', onClick: () => setPot((p) => p + 20) },
        { label: 'new hand ↻', onClick: () => setPot(20) },
      ]}
    >
      <ellipse cx="190" cy="118" rx="148" ry="62" className="doodle-orbit" />
      <ellipse cx="190" cy="118" rx="134" ry="50" className="doodle-surface" />
      {[
        { tx: 'translate(82, 42) rotate(-12)', rank: 'A♠' },
        { tx: 'translate(122, 38) rotate(8)', rank: 'K♣' },
      ].map(({ tx, rank }) => (
        <g key={rank} transform={tx}>
          <rect width="48" height="68" rx="5" className="doodle-surface" />
          <text x="10" y="20" className="doodle-prompt">
            {rank}
          </text>
        </g>
      ))}
      <circle cx="248" cy="108" r="34" className="doodle-orbit" />
      <text x="248" y="106" textAnchor="middle" className="doodle-big">
        {pot}
      </text>
      <text x="248" y="122" textAnchor="middle" className="doodle-small">
        CHIPS
      </text>
    </SketchFrame>
  );
}

export function AutoProjectSketch({ project }: { project: FeaturedProject }) {
  const [activeNode, setActiveNode] = useState(0);
  const nodes = project.stack.slice(0, 3);
  while (nodes.length < 3) nodes.push(project.language || 'Core');

  return (
    <SketchFrame
      title={`${project.type.toLowerCase()} // pipeline`}
      badge="auto-schematic"
      ariaLabel={`${project.name} schematic`}
      readout={`inspecting stage 0${(activeNode % 3) + 1}: ${nodes[activeNode % 3]} · status nominal`}
      actions={[{ label: 'trace next node →', onClick: () => setActiveNode((n) => (n + 1) % 3) }]}
    >
      <rect x="34" y="26" width="312" height="64" rx="8" className="doodle-surface" />
      <text x="190" y="54" textAnchor="middle" className="doodle-prompt">
        {project.name}
      </text>
      <text x="190" y="74" textAnchor="middle" className="doodle-small">
        {project.language.toUpperCase()} · {project.repo}
      </text>
      <path d="M84 90v36M190 90v36M296 90v36" className="doodle-guide" />
      {nodes.map((label, idx) => (
        <g key={idx} transform={`translate(${36 + idx * 106}, 126)`}>
          <rect
            width="96"
            height="48"
            rx="6"
            className={activeNode % 3 === idx ? 'sch-box sch-box-accent' : 'doodle-surface'}
          />
          <text x="48" y="28" textAnchor="middle" className="doodle-small">
            {label.slice(0, 13)}
          </text>
        </g>
      ))}
    </SketchFrame>
  );
}

export function ProjectSketchRenderer({ project }: { project: FeaturedProject }) {
  switch (project.sketch) {
    case 'auth':
      return <AuthSketch />;
    case 'warfare':
      return <WarfareSketch />;
    case 'axis':
      return <AxisSketch />;
    case 'music':
      return <MusicSketch />;
    case 'impromptu':
      return <ImpromptuSketch />;
    case 'poker':
      return <PokerSketch />;
    default:
      return <AutoProjectSketch project={project} />;
  }
}
