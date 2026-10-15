'use client';

import { useEffect, useRef } from 'react';
import { createAnimationLoop } from './animation-loop';

export default function SpaceBackground() {
  const canvas=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const element=canvas.current,context=element?.getContext('2d');
    if(!element||!context)return;
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const random=(seed:number)=>{const n=Math.sin(seed*127.1)*43758.5453;return n-Math.floor(n);};
    const stars=Array.from({length:105},(_,i)=>({x:random(i+1),y:random(i+301),radius:i%19===0?1.2:.35+random(i+601)*.45,phase:random(i+901)*Math.PI*2,speed:1+random(i+1201)*2,color:i%7===0?'#e7c591':i%3===0?'#9fcbdc':'#d0e2e9'}));
    let width=0,height=0,last=0,time=0;
    const paint=()=>{
      context.clearRect(0,0,width,height);
      for(const star of stars){
        const x=(star.x*width+time*star.speed*.65)%(width+20)-10;
        const y=(star.y*height-time*star.speed*.35+height)%height;
        const brightness=motion.matches?1:.65+.35*Math.sin(time*.45+star.phase);
        context.fillStyle=star.color;context.globalAlpha=(star.radius>1?.5:.28)*brightness;
        context.beginPath();context.arc(x,y,star.radius,0,Math.PI*2);context.fill();
        if(star.radius>1){
          context.globalAlpha=.13*brightness;
          context.fillRect(x-3,y-.3,6,.6);context.fillRect(x-.3,y-3,.6,6);
        }
      }
    };
    const resize=()=>{width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio,2);element.width=width*ratio;element.height=height*ratio;context.setTransform(ratio,0,0,ratio,0,0);paint();};
    const draw=(now:number)=>{const delta=Math.min(.1,(now-last)/1000);last=now;if(!motion.matches)time+=delta;paint();};
    resize();const loop=createAnimationLoop(element,draw,()=>20);window.addEventListener('resize',resize);motion.addEventListener('change',resize);
    return()=>{loop.destroy();window.removeEventListener('resize',resize);motion.removeEventListener('change',resize);};
  },[]);
  return <canvas className="space-background" ref={canvas} aria-hidden="true" />;
}
