'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const projects = [
  { name: 'Impromptu', repo: 'impromptu', domain: 'Human input', kind: 'Speaking practice', language: 'TypeScript', symbol: '◌', description: 'A small space to think on your feet. Random topics, timed speaking sessions, and recordings that stay local.', flow: ['Topic', 'Timed session', 'Local recording'], question: 'How can software make practice feel effortless?', x: 72, y: 29 },
  { name: 'Table Stakes', repo: 'poker', domain: 'Shared state', kind: 'Poker chip tracking', language: 'JavaScript', symbol: '♧', description: 'Keep everyone at the table on the same page. Shared chip tracking for Texas Hold’em and Teen Patti.', flow: ['Players', 'Chip tracking', 'Table state'], question: 'How do you keep a group in sync?', x: 75, y: 73 },
  { name: 'Music', repo: 'music', domain: 'Event queues', kind: 'Discord music bot', language: 'JavaScript', symbol: '≋', description: 'A soundtrack for the server. YouTube search, voice playback, and a queue that keeps the music moving.', flow: ['Search', 'Queue', 'Voice playback'], question: 'How do individual requests become a shared experience?', x: 21, y: 63 },
];

export default function ProjectAtlas() {
  const [active, setActive] = useState(0);
  const journey = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!journey.current) return;
        const rect = journey.current.getBoundingClientRect();
        const travel = rect.height - (journey.current.firstElementChild?.getBoundingClientRect().height ?? window.innerHeight);
        const progress = Math.max(0, Math.min(.999, -rect.top / travel));
        setActive(Math.min(2, Math.floor(progress * 3)));
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); cancelAnimationFrame(frame); };
  }, []);
  function select(index: number) {
    if (!journey.current) return;
    const top = journey.current.getBoundingClientRect().top + window.scrollY;
    const travel = journey.current.offsetHeight - (journey.current.firstElementChild?.getBoundingClientRect().height ?? window.innerHeight);
    window.scrollTo({ top: top + travel * ((index + .12) / 3), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  const project = projects[active];
  return <section ref={journey} className="atlas-journey" id="work" aria-label="Interactive project atlas">
    <div className="atlas-sticky">
      <div className="atlas-heading"><div><span className="atlas-kicker">01 — THE PROJECT SYSTEM</span><h2>Different experiments.<br /><em>Connected thinking.</em></h2></div><p>Scroll to travel. Select a node to jump.<br />Every project is a different kind of problem.</p></div>
      <div className="atlas-stage">
        <div className="system-map" aria-label="Select a project">
          <span className="map-coordinate">ASH / PROJECT ATLAS</span>
          <svg viewBox="0 0 600 500" preserveAspectRatio="none" className="orbit-lines" aria-hidden="true">
            <ellipse cx="300" cy="250" rx="208" ry="164" transform="rotate(-25 300 250)" />
            <ellipse cx="300" cy="250" rx="147" ry="111" transform="rotate(30 300 250)" />
            <circle cx="300" cy="250" r="63" />
            {projects.map((p, i) => <line key={p.repo} x1="300" y1="250" x2={p.x * 6} y2={p.y * 5} className={active === i ? 'active-route' : ''} />)}
          </svg>
          <div className="system-core"><span>ash</span><small>BUILD / LEARN / REPEAT</small></div>
          {projects.map((p, i) => <button key={p.repo} className={`planet planet-${i} ${active === i ? 'selected' : ''}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} onClick={() => select(i)} aria-pressed={active === i} aria-label={`Explore ${p.name}: ${p.domain}`}><span className="planet-body">{p.symbol}</span><span className="planet-label"><small>0{i + 1} / {p.domain}</small>{p.name}</span></button>)}
          <span className="map-scale">○ PROJECT &nbsp; ··· CONNECTION &nbsp; ◎ YOU ARE HERE</span>
        </div>
        <article className="project-inspector" aria-live="polite" aria-atomic="true">
          <div className="inspector-meta"><span>NODE / 0{active + 1}</span><span className="project-language">{project.language}</span></div>
          <div className="inspector-content" key={project.repo}>
            <p className="atlas-kicker">{project.kind}</p><h3>{project.name}</h3><p className="project-question">{project.question}</p><p className="inspector-description">{project.description}</p>
            <div className="project-flow"><span className="atlas-kicker">THE FLOW</span>{project.flow.map((step, i) => <div key={step}><small>0{i + 1}</small><span>{step}</span>{i < 2 && <b aria-hidden="true">↓</b>}</div>)}</div>
            <a className="source-link" href={`https://github.com/joshiakshit/${project.repo}`} target="_blank" rel="noopener noreferrer">Explore the source <span>↗</span></a>
          </div>
        </article>
      </div>
      <div className="atlas-controls"><div className="journey-tabs" aria-label="Project navigation">{projects.map((p, i) => <button key={p.repo} onClick={() => select(i)} aria-pressed={i === active}><span>0{i + 1}</span> {p.name}<i className={i <= active ? 'filled' : ''} /></button>)}</div><Link href="/projects">All repositories ↗</Link></div>
    </div>
  </section>;
}
