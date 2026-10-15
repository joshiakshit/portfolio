'use client';

import { memo, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const WireArtifact = dynamic(() => import('./wire-artifact'), { ssr: false });
import { transitionAt } from './story-progress';
import { featuredProjects } from '@/lib/project-catalog';
import { AxisSketch, AuthSketch, WarfareSketch, SpeakingSketch, PokerSketch, MusicSketch } from './project-sketches';

const sketches={'axis':AxisSketch,'auth-service':AuthSketch,'electronic-warfare':WarfareSketch,'music':MusicSketch,'impromptu':SpeakingSketch,'table-stakes':PokerSketch};
const projects=featuredProjects.map(project=>({...project,Sketch:memo<{ active?: boolean }>(sketches[project.id])}));
const labels = ['about', ...projects.map(p => p.name)];
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v*v*(3-2*v);
const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(callback: () => void) { const query=window.matchMedia(motionQuery); query.addEventListener('change',callback); return () => query.removeEventListener('change',callback); }

const Intro = memo(function Intro() {
  return <><h1>Hey, I am Akshit<span>.</span></h1><p className="intro-lead">I like computers.<br />{' '}And making things with them.</p><p className="story-description">CS hobbyist, programmer, and serial tinkerer. This is where I keep the things I build and the things I figure out.</p></>;
});
const ProjectCopy = memo(function ProjectCopy({ index }: { index: number }) {
  const project=projects[index];
  return <><p className="story-kicker">0{index+1} / {project.type}</p><h2>{project.name}<span>.</span></h2><p className="story-description">{project.description}</p><div className="story-project-links"><span className="language-label"><i aria-hidden="true" />{project.language}</span><a className="text-link" href={`https://github.com/joshiakshit/${project.repo}`} target="_blank" rel="noopener noreferrer">view source ↗</a></div></>;
});

export default function ScrollStory() {
  const story=useRef<HTMLElement>(null);
  const navigation=useRef<HTMLElement>(null);
  const [progress,setProgress]=useState(0);
  const reducedMotion=useSyncExternalStore(subscribeMotion,() => window.matchMedia(motionQuery).matches,() => false);
  useEffect(() => {
    if(reducedMotion) return;
    let frame=0;
    const update=() => { if(frame) return; frame=requestAnimationFrame(() => {
      frame=0;
      if(!story.current) return;
      const bounds=story.current.getBoundingClientRect();
      const travel=bounds.height-(story.current.firstElementChild?.getBoundingClientRect().height ?? innerHeight);
      const stickyTop=parseFloat(getComputedStyle(story.current.firstElementChild!).top)||0;
      setProgress(clamp((stickyTop-bounds.top)/Math.max(1,travel))*projects.length);
    }); };
    window.addEventListener('scroll',update,{passive:true}); window.addEventListener('resize',update); update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll',update); window.removeEventListener('resize',update); };
  },[reducedMotion]);
  function goTo(index: number) {
    if(!story.current) return;
    const bounds=story.current.getBoundingClientRect();
    const height=story.current.firstElementChild?.getBoundingClientRect().height ?? innerHeight;
    const stickyTop=parseFloat(getComputedStyle(story.current.firstElementChild!).top)||0;
    const targetProgress=index===0?0:Math.min(projects.length,index+.1);
    window.scrollTo({top:window.scrollY+bounds.top-stickyTop+(bounds.height-height)*targetProgress/projects.length, behavior:reducedMotion?'instant':'smooth'});
  }

  const stage=Math.min(projects.length,Math.floor(progress));
  const mix=transitionAt(progress);
  const weights=labels.map((_,index) => index===stage?1-mix:index===stage+1?mix:0);
  const active=stage+(mix>.5?1:0);
  useEffect(()=>{
    const nav=navigation.current;
    const button=nav?.querySelector<HTMLElement>('[aria-current="step"]');
    if(nav && button && nav.scrollWidth>nav.clientWidth) nav.scrollTo({left:button.offsetLeft-nav.offsetLeft-nav.clientWidth/2+button.offsetWidth/2,behavior:reducedMotion?'instant':'smooth'});
  },[active,reducedMotion]);

  if(reducedMotion) return <section className="static-story" aria-label="Introduction and projects"><div className="static-scene"><div className="story-copy"><Intro /></div><div className="static-artifact"><WireArtifact progress={0} /></div></div>{projects.map((project,index) => <article id={project.id} className="static-scene" key={project.repo}><div className="story-copy"><ProjectCopy index={index} /></div><div className="story-visual"><project.Sketch /></div></article>)}<Link className="text-link" href="/projects">all repositories ↗</Link></section>;



  return <section ref={story} data-scene={active===0?'intro':projects[active-1].id} className="scroll-story" aria-label="Introduction and projects">
    <div className="story-sticky">
      <div className="story-stage">
        <div className="story-copy-stack">
          {labels.map((label,index) => <div key={label} className={`story-copy ${index===0?'intro':''}`} style={{opacity:weights[index] ** 2,transform:weights[index]===1?'none':`translateY(${index===stage?-mix*22:(1-mix)*22}px)`,filter:weights[index]===1?'none':`blur(${(1-weights[index])*6}px)`}} aria-hidden={index!==active} inert={index!==active}>
            {index===0?<Intro />:<ProjectCopy index={index-1} />}
          </div>)}
        </div>
        <div className="story-visual">
          <WireArtifact progress={progress} />
          {projects.map((project,index) => {
            const weight=stage===index+1?1-smooth(clamp(mix/.35)):stage===index?smooth(clamp((mix-.72)/.28)):0;
            return <div className="visual-panel" key={project.repo} style={{opacity:weight,transform:`scale(${.94+weight*.06})`,pointerEvents:weight>.95?'auto':'none'}} aria-hidden={weight<=.95} inert={weight<=.95}><project.Sketch active={weight>.95} /></div>;
          })}
        </div>
      </div>
      <nav ref={navigation} className="story-navigation" style={{opacity:active>0?1:0,pointerEvents:active>0?'auto':'none'}} aria-hidden={active===0} inert={active===0} aria-label="Explore projects">{labels.map((label,index) => <button key={label} onClick={() => goTo(index)} aria-current={active===index?'step':undefined}><span>0{index}</span><b>{label==='Electronic Warfare'?'E-Wave':label==='Auth Service'?'Auth':label}</b><i style={{transform:`scaleX(${clamp(progress-index+1)})`}} /></button>)}<Link href="/projects">all repos ↗</Link></nav>
    </div>
    {projects.map((project,index)=><div id={project.id} key={project.id} className="project-scroll-anchor" style={{top:`calc(${(index+1)/projects.length*100}% - ${(index+1)/projects.length*100}svh + ${(index+1)/projects.length} * var(--story-header))`}} aria-hidden="true" />)}
  </section>;
}
