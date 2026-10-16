'use client';

import { useRef } from 'react';
import { IntroStop } from '@/components/route/intro-stop';
import { ProjectsDetour } from '@/components/route/projects-detour';
import { RecapStop } from '@/components/route/recap-stop';
import { SkillsStop } from '@/components/route/skills-stop';
import { useRouteScroll } from '@/components/route/use-route-scroll';

export default function RouteStory() {
  const wrapperRef = useRef<HTMLElement>(null);
  useRouteScroll(wrapperRef);

  return (
    <>
      <div id="progress-indicator" className="progress-hud" aria-live="polite">
        stop 0/4
      </div>

      <main ref={wrapperRef} id="route-wrapper" className="route-wrapper">
        <svg id="route-svg" className="route-svg" aria-hidden="true">
          <defs>
            <clipPath id="clip-top">
              <rect id="clip-rect-top" x="0" y="0" width="2000" height="0" />
            </clipPath>
            <clipPath id="clip-bottom">
              <rect id="clip-rect-bottom" x="0" y="0" width="2000" height="0" />
            </clipPath>
          </defs>
          <path id="ghost-path-top" className="path-ghost"></path>
          <path id="drawn-path-top" className="path-drawn" clipPath="url(#clip-top)"></path>
          <path id="ghost-path-bottom" className="path-ghost"></path>
          <path id="drawn-path-bottom" className="path-drawn" clipPath="url(#clip-bottom)"></path>
          <g id="branches-group" className="branches-group"></g>
          <g id="anchor-nodes"></g>
          <circle id="tip-circle" className="tip-marker" r="5"></circle>
        </svg>

        <IntroStop />
        <ProjectsDetour />
        <SkillsStop />
        <RecapStop />
      </main>
    </>
  );
}
