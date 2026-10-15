'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function HomeHeader() {
  const [visible,setVisible]=useState(false);
  const header=useRef<HTMLElement>(null);
  useEffect(()=>{
    let frame=0;
    const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
      const firstProject=document.getElementById('auth-service');
      const height=header.current?.offsetHeight??72;
      setVisible(Boolean(firstProject&&firstProject.getBoundingClientRect().top<=height+12));
    });};
    window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update);};
  },[]);
  return <header ref={header} className={`site-header home-header ${visible?'is-visible':''}`} aria-hidden={!visible} inert={!visible}>
    <Link className="wordmark" href="/" aria-label="ash home">ash<span className="wordmark-dot">.</span></Link>

  </header>;
}
