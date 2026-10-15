'use client';

import { useEffect, useRef, useState } from 'react';

const topics = ['Explain the internet\nto a time traveler.', 'What would you build\nwith an extra day?', 'Defend your most\nunpopular food opinion.', 'Teach a robot\nhow to make a friend.'];

export function SpeakingSketch({ active = true }: { active?: boolean }) {
  const [topic, setTopic] = useState(0);
  const [timer, setTimer] = useState({ remaining: 30, running: false });

  useEffect(() => {
    if (!timer.running || !active) return;
    const id = window.setInterval(() => setTimer(previous => ({ remaining: Math.max(0, previous.remaining - 1), running: previous.remaining > 1 })), 1000);
    return () => window.clearInterval(id);
  }, [timer.running, active]);

  function nextTopic() {
    setTopic(previous => (previous + 1) % topics.length);
    setTimer({ remaining: 30, running: false });
  }

  return <div className="project-sketch speaking-sketch">
    <div className="sketch-topline"><span>05 / think on your feet</span><span className="sketch-demo">try it</span></div>
    <div className="speaking-stage">
      <div className="prompt-paper"><span className="paper-pin" /><span className="prompt-label">your topic, no preparation.</span><p aria-live="polite">{topics[topic]}</p><svg viewBox="0 0 150 12" aria-hidden="true"><path d="M2 8 Q60 0 145 6 M15 11 Q75 5 132 9" /></svg></div>
      <button className={`sketch-timer ${timer.running ? 'is-running' : ''}`} onClick={() => setTimer(previous => ({ remaining: previous.remaining || 30, running: !previous.running }))} aria-label={timer.running ? 'Pause speaking timer' : timer.remaining === 0 ? 'Restart speaking timer' : 'Start speaking timer'}>
        <svg viewBox="0 0 80 80" aria-hidden="true"><circle className="timer-track" cx="40" cy="40" r="33" /><circle className="timer-progress" cx="40" cy="40" r="33" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - timer.remaining / 30 * 100} /></svg>
        <span>{String(timer.remaining).padStart(2, '0')}<small>{timer.running ? 'pause' : timer.remaining === 0 ? 'again?' : timer.remaining < 30 ? 'resume' : 'start'}</small></span>
      </button>
    </div>
    <div className="sketch-controls"><button className="sketch-button" onClick={nextTopic}>another topic <span aria-hidden="true">↻</span></button><span>{timer.remaining === 0 ? 'Time’s up. Nicely done.' : '30 seconds. Give it a go.'}</span></div>
  </div>;
}

export function PokerSketch() {
  const [chips, setChips] = useState(0);
  return <div className="project-sketch poker-sketch">
    <div className="sketch-topline"><span>06 / just one more hand</span><span className="sketch-demo">try it</span></div>
    <div className="poker-stage">
      <svg className="poker-doodle" viewBox="0 0 360 170" aria-hidden="true">
        <ellipse className="table-edge" cx="180" cy="100" rx="144" ry="57" /><ellipse className="table-inner" cx="180" cy="100" rx="133" ry="47" />
        <g transform="translate(66 25) rotate(-15 27 36)"><rect className="playing-card" width="50" height="71" rx="5" /><text x="8" y="19">A</text><text x="16" y="50" className="card-suit">♠</text></g>
        <g transform="translate(104 23) rotate(9 27 36)"><rect className="playing-card second-card" width="50" height="71" rx="5" /><text x="8" y="19">K</text><text x="16" y="50" className="card-suit">♣</text></g>
        <path className="table-scribble" d="M251 33q20 3 22 25m-10-4 10 5 5-10" /><text className="table-note" x="238" y="26">your move</text>
        {[0, 1, 2].map(stack => <g key={stack} transform={`translate(${147 + stack * 34} ${111 - stack * 4})`}>{Array.from({ length: Math.min(8, 2 + Math.floor((chips + 2 - stack) / 3)) }, (_, index) => <g key={index} transform={`translate(0 ${-index * 6})`}><ellipse className={`chip-base chip-color-${stack}`} cx="0" cy="3" rx="18" ry="7" /><ellipse className={`chip-face chip-color-${stack}`} rx="18" ry="7" /><ellipse className="chip-ring" rx="12" ry="4" /></g>)}</g>)}
      </svg>
      <button className="pot-button" onClick={() => setChips(previous => previous + 1)} aria-label="Add 10 chips to the demo pot"><span className="pot-value">{chips * 10}</span><span>in the pot <b aria-hidden="true">+</b></span></button>
    </div>
    <div className="sketch-controls"><button className="sketch-button" onClick={() => setChips(0)} disabled={chips === 0}>new hand <span aria-hidden="true">↻</span></button><span>tap the pot to add 10</span></div>
  </div>;
}

const initialBeats = [true, false, true, false, true, true, false, true];
const heights = [18, 35, 57, 28, 76, 44, 91, 62, 38, 83, 51, 97, 65, 39, 75, 49, 24, 54, 34, 16];

export function MusicSketch({ active = true }: { active?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [beats, setBeats] = useState(initialBeats);
  const [step, setStep] = useState(-1);
  const [tempo, setTempo] = useState(110);
  const [visible, setVisible] = useState(false);
  const sketch = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting));
    if (sketch.current) observer.observe(sketch.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible || !active) return;
    const id = window.setInterval(() => setStep(previous => (previous + 1) % 8), 60000 / tempo / 2);
    return () => window.clearInterval(id);
  }, [playing, visible, tempo, active]);

  return <div ref={sketch} className={`project-sketch music-sketch ${playing && visible && active ? 'is-playing' : ''} ${step >= 0 && beats[step] ? 'beat-active' : ''}`}>
    <div className="sketch-topline"><span>04 / a little visual rhythm</span><span className="sketch-demo">try it</span></div>
    <div className="music-stage">
      <div className="waveform" aria-hidden="true">{heights.map((height, index) => <i key={index} style={{ height: `${height}%`, animationDelay: `${index * -0.11}s` }} />)}</div>
      <div className="beat-grid" role="group" aria-label="Rhythm steps">{beats.map((enabled, index) => <button key={index} className={`${enabled ? 'enabled' : ''} ${playing && step === index ? 'current-step' : ''}`} onClick={() => setBeats(previous => previous.map((beat, i) => i === index ? !beat : beat))} aria-label={`Beat ${index + 1}`} aria-pressed={enabled}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></button>)}</div>
    </div>
    <div className="sketch-controls music-controls"><button className="sketch-button" aria-pressed={playing} onClick={() => { if (!playing && step < 0) setStep(0); setPlaying(previous => !previous); }}>{playing ? 'Ⅱ pause' : '▷ play'}</button><label className="tempo-control"><input aria-label="Visual loop tempo" type="range" min="60" max="160" value={tempo} onChange={event => setTempo(Number(event.target.value))} /><span>{tempo} bpm</span></label></div>
    <p className="visual-loop-note">toggle the steps · visual loop, no audio</p>
  </div>;
}

export function AxisSketch() {
  const [attendance, setAttendance] = useState({ attended: 9, total: 12 });
  const percent = Math.round(attendance.attended / attendance.total * 100);
  return <div className="project-sketch axis-sketch">
    <div className="sketch-topline"><span>attendance sandbox</span><span className="sketch-demo">try it</span></div>
    <svg className="service-doodle axis-phone" viewBox="0 0 400 265" role="img" aria-label={`Demo attendance: ${percent} percent, ${attendance.attended} out of ${attendance.total} classes`}>
      <rect x="114" y="5" width="172" height="253" rx="22" className="doodle-surface" /><rect x="174" y="13" width="52" height="5" rx="3" />
      <text x="133" y="42" className="doodle-wordmark">axis</text><path d="M251 35h14m-10-4v8" />
      <circle cx="200" cy="108" r="43" className="doodle-track" /><circle cx="200" cy="108" r="43" className="attendance-ring" pathLength="100" strokeDasharray={`${percent} 100`} transform="rotate(-90 200 108)" />
      <text x="200" y="111" textAnchor="middle" className="doodle-value">{percent}%</text><text x="200" y="128" textAnchor="middle" className="doodle-small">{attendance.attended} / {attendance.total} classes</text>
      <text x="132" y="175" className="doodle-small">NEXT UP</text><rect x="130" y="185" width="140" height="24" rx="4" /><path d="M138 197h5m9 0h63m25 0h20" /><rect x="130" y="216" width="140" height="24" rx="4" /><path d="M138 228h5m9 0h48m40 0h20" />
      <path d="M86 74h-24v36m253 83h23v-35" className="doodle-guide" /><text x="34" y="127" className="doodle-small">plan.</text><text x="307" y="145" className="doodle-small">attend.</text>
    </svg>
    <div className="sketch-controls"><div className="sketch-action-group"><button className="sketch-button" onClick={() => setAttendance(a => ({ attended: a.attended + 1, total: a.total + 1 }))}>attend +</button><button className="sketch-button" onClick={() => setAttendance(a => ({ ...a, total: a.total + 1 }))}>skip −</button></div><button className="sketch-button" onClick={() => setAttendance({ attended: 9, total: 12 })}>reset ↻</button></div>
  </div>;
}

export function AuthSketch() {
  const [token, setToken] = useState<number | null>(null);
  const [generation, setGeneration] = useState(0);
  function issue() { const next = generation + 1; setGeneration(next); setToken(next); }
  return <div className={`project-sketch auth-sketch ${token !== null ? 'token-issued' : ''}`}>
    <div className="sketch-topline"><span>the life of a token</span><span className="sketch-demo">local demo</span></div>
    <svg className="service-doodle auth-lock" viewBox="0 0 400 265" aria-hidden="true">
      <circle cx="200" cy="112" r="83" className="doodle-guide" /><circle cx="200" cy="112" r="74" className="doodle-guide" strokeDasharray="2 9" />
      <path d={token !== null ? 'M173 106V80a27 27 0 0 1 54 0' : 'M173 106V80a27 27 0 0 1 54 0v26'} className="lock-shackle" /><rect x="156" y="105" width="88" height="64" rx="10" className="doodle-surface" />
      {token !== null ? <path d="m183 137 12 12 24-28" className="auth-check" /> : <><circle cx="200" cy="131" r="6" /><path d="M200 137v13" /></>}
      <path d="M51 210h297" className="doodle-guide" />{[70,200,330].map((x,i) => <g key={x}><rect x={x-26} y="197" width="52" height="27" rx="5" className="doodle-surface" /><text x={x} y="214" textAnchor="middle" className="doodle-small">{['client','auth','app'][i]}</text></g>)}<path d="m117 206 6 4-6 4m130-8 6 4-6 4" className={token !== null ? 'auth-check' : 'doodle-guide'} />
    </svg>
    <p className="token-readout" aria-live="polite">{token === null ? 'no token · access locked' : `DEMO-${String(token).padStart(3,'0')} · access granted`}</p>
    <div className="sketch-controls"><button className="sketch-button" onClick={issue}>{token === null ? 'issue demo token →' : 'rotate token ↻'}</button><button className="sketch-button" onClick={() => setToken(null)} disabled={token === null}>revoke ×</button></div>
  </div>;
}

const demoSignals = [18, 64, 35, 88, 26, 72, 42, 55];
const scanOrder = [3, 5, 1, 7, 6, 2, 4, 0];
export function WarfareSketch() {
  const [scan, setScan] = useState(-1);
  const band = scan < 0 ? -1 : scanOrder[scan % scanOrder.length];
  return <div className="project-sketch warfare-sketch">
    <div className="sketch-topline"><span>one receiver. eight bands.</span><span className="sketch-demo">illustration</span></div>
    <svg className="service-doodle spectrum-doodle" viewBox="0 0 400 265" role="img" aria-label={band < 0 ? 'Illustrative spectrum, eight frequency bands' : `Illustrative receiver observing band ${band+1}`}>
      {[55,95,135,175].map(y => <path key={y} d={`M37 ${y}h326`} className="doodle-guide" />)}
      <path d="M37 34v173h326" /><text x="37" y="23" className="doodle-small">OBSERVATION WINDOW</text>
      {demoSignals.map((strength,i) => <g key={i} className={band === i ? 'band-selected' : ''}><rect x={47+i*39} y={200-strength*1.5} width="24" height={strength*1.5} rx="2" className="spectrum-bar" /><text x={59+i*39} y="225" textAnchor="middle" className="doodle-small">0{i+1}</text></g>)}
      {band >= 0 && <g><rect x={43+band*39} y="38" width="32" height="169" className="receiver-window" /><path d={`M${43+band*39} 31h32m-16-5v10`} /></g>}
      <text x="200" y="252" textAnchor="middle" className="doodle-small">FREQUENCY BANDS →</text>
    </svg>
    <div className="sketch-controls"><button className="sketch-button" onClick={() => setScan(s => s+1)}>scan next band →</button><span aria-live="polite">{band < 0 ? 'ready to observe' : `observing band ${band+1}`}</span></div><p className="visual-loop-note">illustrative pattern · no receiver connected</p>
  </div>;
}
