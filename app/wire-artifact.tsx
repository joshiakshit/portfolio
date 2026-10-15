'use client';

import { useEffect, useRef } from 'react';
import { CORE_PART, TRANSITION_START, clamp, Point, rings, rotation, smooth, lineTargets, transitionAt, TAU } from './artifact-geometry';

import { createAnimationLoop } from './animation-loop';
import { artifactParticles } from './artifact-particles';

const HOME={pitch:-.24,yaw:-.2};
const ringOrientations=rings.map(ring=>rotation(ring.x,ring.y,ring.z));

export default function WireArtifact({ progress }: { progress: number }) {
  const canvas=useRef<HTMLCanvasElement>(null);
  const dustCanvas=useRef<HTMLCanvasElement>(null);
  const progressRef=useRef(progress);
  const invalidateRef=useRef<() => void>(()=>{});
  const reset=useRef<() => void>(()=>{});
  const interactive=progress<TRANSITION_START;
  useEffect(()=>{progressRef.current=progress;invalidateRef.current();},[progress]);

  useEffect(()=>{
    const element=canvas.current;
    const context=element?.getContext('2d');
    const dust=dustCanvas.current,dustContext=dust?.getContext('2d');
    if(!element || !context || !dust || !dustContext) return;
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    let width=0,height=0,lastTime=0,activeTime=0,entranceTime=0;
    let pitch=HOME.pitch,yaw=HOME.yaw,velocityX=0,velocityY=0,dragging=false;
    let lastX=0,lastY=0,lastMove=0,pointerId:number|null=null;
    let invalidate=()=>{};
    const mobile=matchMedia('(max-width: 600px)');
    let particles=artifactParticles.filter((_,index)=>index%(mobile.matches?4:2)===0);
    let resetTween:{pitch:number;yaw:number;start:number}|null=null;
    reset.current=()=>{
      velocityX=0;velocityY=0;
      if(motion.matches){pitch=HOME.pitch;yaw=HOME.yaw;resetTween=null;}
      else {
        yaw=HOME.yaw+Math.atan2(Math.sin(yaw-HOME.yaw),Math.cos(yaw-HOME.yaw));
        resetTween={pitch,yaw,start:performance.now()};
      }
      invalidate();
    };
    const resize=new ResizeObserver(entries=>{
      width=entries[0].contentRect.width;height=entries[0].contentRect.height;
      const ratio=Math.min(devicePixelRatio,mobile.matches?1.5:2);
      element.width=width*ratio;element.height=height*ratio;context.setTransform(ratio,0,0,ratio,0,0);invalidate();
    });
    resize.observe(element);
    let viewportWidth=innerWidth,viewportHeight=innerHeight;
    const resizeDust=()=>{
      particles=artifactParticles.filter((_,index)=>index%(mobile.matches?4:2)===0);
      viewportWidth=innerWidth;viewportHeight=innerHeight;
      const ratio=Math.min(devicePixelRatio,mobile.matches?1.5:2);
      dust.width=viewportWidth*ratio;dust.height=viewportHeight*ratio;
      dustContext.setTransform(ratio,0,0,ratio,0,0);invalidate();
    };
    resizeDust();window.addEventListener('resize',resizeDust);

    const down=(event:PointerEvent)=>{
      if(progressRef.current>=TRANSITION_START || !event.isPrimary || event.button!==0) return;
      resetTween=null;dragging=true;pointerId=event.pointerId;lastX=event.clientX;lastY=event.clientY;lastMove=event.timeStamp;velocityX=0;velocityY=0;
      element.setPointerCapture(event.pointerId);element.focus({preventScroll:true});element.dataset.dragging='true';invalidate();
    };
    const move=(event:PointerEvent)=>{
      if(!dragging || event.pointerId!==pointerId) return;
      const dx=event.clientX-lastX,dy=event.pointerType==='touch'?0:event.clientY-lastY;
      const elapsed=Math.max(.008,(event.timeStamp-lastMove)/1000);
      yaw+=dx*.007;pitch=Math.max(-1.05,Math.min(.8,pitch+dy*.005));
      velocityX=Math.max(-2.4,Math.min(2.4,dx*.007/elapsed));velocityY=Math.max(-1.2,Math.min(1.2,dy*.005/elapsed));
      lastX=event.clientX;lastY=event.clientY;lastMove=event.timeStamp;invalidate();
    };
    const up=(event:PointerEvent)=>{
      if(event.pointerId!==pointerId) return;
      dragging=false;pointerId=null;delete element.dataset.dragging;
      if(event.type==='pointercancel' || event.timeStamp-lastMove>100 || motion.matches){velocityX=0;velocityY=0;}
      if(element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    };
    const key=(event:KeyboardEvent)=>{
      if(progressRef.current>=TRANSITION_START) return;
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key)) return;
      event.preventDefault();velocityX=0;velocityY=0;
      if(event.key==='Home') reset.current(); else resetTween=null;
      if(event.key==='ArrowLeft') yaw-=.15;
      if(event.key==='ArrowRight') yaw+=.15;
      if(event.key==='ArrowUp') pitch=Math.max(-1.05,pitch-.12);
      if(event.key==='ArrowDown') pitch=Math.min(.8,pitch+.12);
      invalidate();
    };
    element.addEventListener('pointerdown',down);element.addEventListener('pointermove',move);
    element.addEventListener('pointerup',up);element.addEventListener('pointercancel',up);element.addEventListener('lostpointercapture',up);element.addEventListener('keydown',key);

    const project=(point:Point):Point=>{const depth=580/(580-point[2]);return [point[0]*depth,point[1]*depth,point[2]];};
    const draw=(timestamp:number)=>{
      const delta=Math.min(.05,Math.max(0,(timestamp-lastTime)/1000));lastTime=timestamp;
      if(!width || !height || document.hidden) return;
      const progress=progressRef.current,stage=Math.min(lineTargets.length,Math.floor(progress)),t=transitionAt(progress);
      const show=stage===0?1-smooth(clamp((t-.86)/.14)):stage<lineTargets.length?Math.min(1,Math.sin(t*Math.PI)*2):0;
      // The scheduler invalidates once when motion preferences change.
      context.clearRect(0,0,width,height);
      dustContext.clearRect(0,0,viewportWidth,viewportHeight);
      if(!motion.matches) {
        activeTime+=delta;
        if(!dragging && !resetTween){yaw+=velocityX*delta;pitch=Math.max(-1.05,Math.min(.8,pitch+velocityY*delta));velocityX*=Math.exp(-delta*4.2);velocityY*=Math.exp(-delta*4.2);}
      }
      if(resetTween){
        const position=clamp((timestamp-resetTween.start)/850),ease=smooth(position);
        pitch=resetTween.pitch+(HOME.pitch-resetTween.pitch)*ease;
        yaw=resetTween.yaw+(HOME.yaw-resetTween.yaw)*ease;
        if(position===1) resetTween=null;
      }
      const globalRotation=rotation(pitch,yaw,0);
      const spins=rings.map(ring=>rotation(0,0,activeTime*ring.speed*5.5));
      const coreRotation=rotation(0,activeTime*.3,activeTime*.13);
      const globeScale=Math.min(width/385,height/385);
      const sketchScale=Math.min(width/(width<450?420:460),height/510);
      const scale=stage===0?globeScale+(sketchScale-globeScale)*t:sketchScale;
      context.save();context.translate(width/2,height/2);context.scale(scale,scale);
      context.globalCompositeOperation='lighter';
      if(!motion.matches) entranceTime+=delta;
      const formation=motion.matches?1:smooth(clamp((entranceTime-.15)/3.8));
      element.dataset.formation=formation>=1?'complete':'gathering';
      const bounds=element.getBoundingClientRect();
      const centerX=bounds.left+width/2,centerY=bounds.top+height/2;
      const scatter=smooth(clamp((progress-.05)/.83));
      const assembled=formation*(1-scatter);
      dust.dataset.state=assembled>.98?'formed':scatter>.98?'scattered':'gathering';
      const glow=assembled*(motion.matches?1:.94+Math.sin(activeTime*1.7)*.06);
      dustContext.globalAlpha=1;
      dustContext.globalCompositeOperation='source-over';
      if(glow>.001){
        dustContext.save();dustContext.translate(centerX,centerY);dustContext.scale(globeScale,globeScale);
        const halo=dustContext.createRadialGradient(0,0,0,0,0,86);
        halo.addColorStop(0,`rgba(241,251,255,${.95*glow})`);
        halo.addColorStop(.09,`rgba(211,244,255,${.8*glow})`);
        halo.addColorStop(.24,`rgba(130,213,239,${.28*glow})`);
        halo.addColorStop(.55,`rgba(110,159,230,${.075*glow})`);
        halo.addColorStop(1,'rgba(0,0,0,0)');
        dustContext.fillStyle=halo;dustContext.fillRect(-86,-86,172,172);dustContext.restore();
      }
      const colors=['#edf5ff','#86c9ed','#e2b87b','#9de5db'];
      dustContext.globalCompositeOperation='lighter';
      particles.forEach(particle=>{
        let p=particle.point;
        if(particle.part<rings.length)p=ringOrientations[particle.part](spins[particle.part](p));
        else p=coreRotation(p);
        const position=project(globalRotation(p));
        const gather=(particle.seed>.965?0:smooth(clamp((formation-particle.seed*.14)/.86)))*(1-scatter);
        const fieldX=((particle.field[0]*viewportWidth+activeTime*(1+particle.seed)*1.2)%(viewportWidth+16))-8;
        const fieldY=((particle.field[1]*viewportHeight-activeTime*(.4+particle.seed)+viewportHeight*10)%(viewportHeight+16))-8;
        const curve=Math.sin(gather*Math.PI)*(1-scatter)*32;
        const x=fieldX+(centerX+position[0]*globeScale-fieldX)*gather+Math.sin(particle.seed*TAU)*curve;
        const y=fieldY+(centerY+position[1]*globeScale-fieldY)*gather+Math.cos(particle.seed*TAU)*curve;
        const brightness=clamp((position[2]+180)/360);
        const twinkle=motion.matches?1:.86+Math.sin(activeTime*.8+particle.seed*20)*.14;
        dustContext.globalAlpha=Math.min(1,particle.opacity*(.48+brightness*.6)*twinkle*(.38+.62*gather)*(particle.part===CORE_PART?1.15:1));
        dustContext.fillStyle=colors[particle.color];
        const size=Math.max(.35,particle.radius*(.65+brightness*.55)*(.85+(globeScale-.85)*gather));
        dustContext.beginPath();dustContext.arc(x,y,size*.5,0,TAU);dustContext.fill();
        if(particle.radius>2.4 && gather>.2){
          const glint=dustContext.createRadialGradient(x,y,0,x,y,size*2.2);
          glint.addColorStop(0,colors[particle.color]);glint.addColorStop(1,'rgba(0,0,0,0)');
          dustContext.globalAlpha*=.18;dustContext.fillStyle=glint;
          dustContext.fillRect(x-size*2.2,y-size*2.2,size*4.4,size*4.4);
        }
      });
      if(t>0 && (stage>0 || t>.2)){
        const source=stage===0?null:lineTargets[stage-1];
        const destination=lineTargets[Math.min(stage,lineTargets.length-1)];
        context.globalCompositeOperation='source-over';
        context.globalAlpha=show*(stage===0?smooth(clamp((t-.2)/.45)):1)*.7;
        context.strokeStyle='#c4e0e8';context.lineWidth=.8/scale;
        context.beginPath();
        destination.forEach((edge,index)=>{
          let from=source?.[index];
          if(!from){
            const grain=artifactParticles[index%artifactParticles.length];
            let p=grain.point;
            if(grain.part<rings.length)p=ringOrientations[grain.part](spins[grain.part](p));
            p=globalRotation(p);
            const projected=project(p);from=[projected,projected];
          }
          const points=edge.map((point,end)=>point.map((value,axis)=>from[end][axis]+(value-from[end][axis])*t) as Point);
          context.moveTo(points[0][0],points[0][1]);context.lineTo(points[1][0],points[1][1]);
        });
        context.stroke();
      }
      context.restore();
    };
    const loop=createAnimationLoop(element,draw,()=>mobile.matches?30:45);
    invalidate=loop.invalidate;
    invalidateRef.current=()=>{invalidate();};
    return()=>{loop.destroy();invalidateRef.current=()=>{};resize.disconnect();window.removeEventListener('resize',resizeDust);element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',move);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',up);element.removeEventListener('lostpointercapture',up);element.removeEventListener('keydown',key);};
  },[]);

  return <><canvas ref={dustCanvas} className="artifact-dust" aria-hidden="true" /><canvas ref={canvas} className="wire-artifact" style={{pointerEvents:interactive?'auto':'none'}} tabIndex={interactive?0:-1} role="img" aria-label="Eight rings of moving dust around a luminous core. Drag or use arrow keys to rotate." aria-hidden={!interactive} /></>;
}
