'use client';

import { type RefObject, useEffect } from 'react';
import { featuredProjects } from '@/lib/project-catalog';
import { SKILL_BRANCHES } from '@/lib/site-data';
import {
  buildHorizWavePath,
  EMPTY_SAMPLE_TABLE,
  lookupPath,
  type PathSampleTable,
  setPathAndSample,
  svgEl,
} from '@/lib/svg-path';

const CONFIG = {
  tipPosition: 0.58,
  textLead: 0.22,
  introDelayMs: 200,
  hintDelayMs: 2400,
  slidePortion: 0.78,
};

const byId = <T extends Element = HTMLElement>(id: string) =>
  document.getElementById(id) as T | null;

function rectCenter(el: Element, refRect: DOMRect) {
  const r = el.getBoundingClientRect();
  return { x: r.left - refRect.left + r.width * 0.5, y: r.top - refRect.top + r.height * 0.5 };
}

export function useRouteScroll(wrapperRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    document.documentElement.classList.add('js');
    const wrapper = wrapperRef.current;
    const svg = byId<SVGSVGElement>('route-svg');
    const ghostTop = byId<SVGPathElement>('ghost-path-top');
    const drawnTop = byId<SVGPathElement>('drawn-path-top');
    const ghostBottom = byId<SVGPathElement>('ghost-path-bottom');
    const drawnBottom = byId<SVGPathElement>('drawn-path-bottom');
    const clipRectTop = byId<SVGRectElement>('clip-rect-top');
    const clipRectBottom = byId<SVGRectElement>('clip-rect-bottom');
    const tipCircle = byId<SVGCircleElement>('tip-circle');
    const nodesGroup = byId<SVGGElement>('anchor-nodes');
    const branchesGroup = byId<SVGGElement>('branches-group');
    const detourSection = byId('stop-2');
    const track = byId('projects-track');
    const horizSvg = byId<SVGSVGElement>('horiz-svg');
    const horizGhost = byId<SVGPathElement>('horiz-ghost-path');
    const horizDrawn = byId<SVGPathElement>('horiz-drawn-path');
    const clipRectHoriz = byId<SVGRectElement>('clip-rect-horiz');
    const horizNodes = byId<SVGGElement>('horiz-nodes');
    const horizTip = byId<SVGCircleElement>('horiz-tip');
    const detourCounter = byId('detour-counter');
    const progressEl = byId('progress-indicator');
    const scrollHint = byId('scroll-hint');

    if (
      !wrapper || !svg || !ghostTop || !drawnTop || !ghostBottom || !drawnBottom ||
      !clipRectTop || !clipRectBottom || !tipCircle || !nodesGroup || !branchesGroup ||
      !detourSection || !track || !horizSvg || !horizGhost || !horizDrawn ||
      !clipRectHoriz || !horizNodes || !horizTip
    ) return;

    const stop1Txt = document.querySelector('#stop-1 .txt');
    const stop3Txt = document.querySelector('#stop-3 .txt');
    const stop4Txt = document.querySelector('#stop-4 .txt');

    let nodeStop1: SVGCircleElement | null = null;
    let nodeStop3: SVGCircleElement | null = null;
    let nodeStop4: SVGCircleElement | null = null;
    let hCircles: SVGCircleElement[] = [];
    let hReachedState: boolean[] = [];
    let skillBranchEls: SVGGElement[] = [];

    let isDesktopHoriz = false;
    let topTable: PathSampleTable = EMPTY_SAMPLE_TABLE;
    let horizTable: PathSampleTable = EMPTY_SAMPLE_TABLE;
    let botTable: PathSampleTable = EMPTY_SAMPLE_TABLE;

    let stop1Pt = { x: 0, y: 0 };
    let stop2TopY = 0;
    let stop2BottomY = 0;
    let maxTrackTx = 0;
    let stationRelX: number[] = [];
    let exitTrackX = 0;
    let horizLineY = 0;
    let bottomPts: { x: number; y: number }[] = [];

    let rafPending = false;
    let userScrolled = false;
    let skillsBranchesDrawn = false;
    let prevHudText = '';
    let prevCounterText = '';

    const setHudText = (txt: string) => {
      if (progressEl && prevHudText !== txt) {
        prevHudText = txt;
        progressEl.textContent = txt;
      }
    };

    const setCounterText = (txt: string) => {
      if (detourCounter && prevCounterText !== txt) {
        prevCounterText = txt;
        detourCounter.textContent = txt;
      }
    };

    function measure() {
      isDesktopHoriz =
        window.innerWidth > 820 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track!.style.transform = 'none';

      const wRect = wrapper!.getBoundingClientRect();
      const wrapperW = wrapper!.offsetWidth;
      const wrapperH = wrapper!.scrollHeight;
      svg!.setAttribute('width', String(wrapperW));
      svg!.setAttribute('height', String(wrapperH));
      svg!.setAttribute('viewBox', `0 0 ${wrapperW} ${wrapperH}`);
      clipRectTop!.setAttribute('width', String(wrapperW));
      clipRectBottom!.setAttribute('width', String(wrapperW));

      nodesGroup!.innerHTML = '';
      branchesGroup!.innerHTML = '';
      horizNodes!.innerHTML = '';
      hCircles = [];
      hReachedState = [];
      skillBranchEls = [];

      if (!isDesktopHoriz) {
        ghostBottom!.setAttribute('d', '');
        drawnBottom!.setAttribute('d', '');
        const mobilePts = Array.from(
          document.querySelectorAll('#stop-1 .anchor, .project-station, #stop-3 .anchor, #stop-4 .anchor'),
        ).map((el) => {
          const r = el.getBoundingClientRect();
          return {
            x: 22,
            y: r.top - wRect.top + Math.min(r.height * 0.5, 90),
            isProj: el.classList.contains('project-station'),
          };
        });
        if (!mobilePts.length) return;

        let d = 'M 22 0';
        let prev = { x: 22, y: 0 };
        for (const pt of mobilePts) {
          const my = ((prev.y + pt.y) * 0.5).toFixed(1);
          d += ` C ${prev.x} ${my}, ${pt.x} ${my}, ${pt.x} ${pt.y.toFixed(1)}`;
          prev = pt;
          const g = svgEl('g');
          if (pt.isProj) g.appendChild(svgEl('circle', { class: 'project-ring', cx: pt.x, cy: pt.y.toFixed(1), r: 13 }));
          g.appendChild(svgEl('circle', { class: 'node-circle is-reached', cx: pt.x, cy: pt.y.toFixed(1), r: pt.isProj ? 8 : 6 }));
          nodesGroup!.appendChild(g);
        }
        topTable = setPathAndSample(ghostTop!, drawnTop!, d, 12);
        document.querySelectorAll('.stop .txt, .project-station .txt').forEach((el) => el.classList.add('is-visible'));
        return;
      }

      const stop1Anchor = document.querySelector('#stop-1 .anchor')!;
      const stop3Anchor = document.querySelector('#stop-3 .anchor')!;
      const stop4Anchor = document.querySelector('#stop-4 .anchor')!;
      const stations = Array.from(document.querySelectorAll('.project-station'));

      stop1Pt = rectCenter(stop1Anchor, wRect);
      const detourRect = detourSection!.getBoundingClientRect();
      stop2TopY = detourRect.top - wRect.top;
      stop2BottomY = detourRect.bottom - wRect.top;

      const vh = window.innerHeight;
      const trackRect = track!.getBoundingClientRect();
      const firstGrid = stations[0].querySelector('.station-grid') || stations[0];
      horizLineY = Math.max(115, firstGrid.getBoundingClientRect().top - trackRect.top - 22);

      stationRelX = stations.map((st, idx) => {
        const sr = st.getBoundingClientRect();
        return idx === stations.length - 1 ? sr.left - trackRect.left + sr.width * 0.5 : sr.left - trackRect.left + 42;
      });

      const entryX = stationRelX[0];
      exitTrackX = stationRelX[stationRelX.length - 1];
      maxTrackTx = Math.max(0, exitTrackX - window.innerWidth * 0.5);
      const exitScreenX = exitTrackX - maxTrackTx;

      const svgTrackW = Math.max(track!.scrollWidth, Math.ceil(exitTrackX + window.innerWidth * 0.5));
      horizSvg!.setAttribute('width', String(svgTrackW));
      horizSvg!.setAttribute('height', String(vh));
      horizSvg!.setAttribute('viewBox', `0 0 ${svgTrackW} ${vh}`);

      const startX = wrapperW * 0.5;
      const midY1 = stop1Pt.y * 0.5;
      const midY2 = (stop1Pt.y + stop2TopY) * 0.5;
      topTable = setPathAndSample(
        ghostTop!,
        drawnTop!,
        `M ${startX.toFixed(1)} 0 C ${startX.toFixed(1)} ${midY1.toFixed(1)}, ${stop1Pt.x.toFixed(1)} ${midY1.toFixed(1)}, ${stop1Pt.x.toFixed(1)} ${stop1Pt.y.toFixed(1)} C ${stop1Pt.x.toFixed(1)} ${midY2.toFixed(1)}, ${entryX.toFixed(1)} ${midY2.toFixed(1)}, ${entryX.toFixed(1)} ${stop2TopY.toFixed(1)}`,
        10,
      );

      nodeStop1 = svgEl('circle', { class: 'node-circle', cx: stop1Pt.x.toFixed(1), cy: stop1Pt.y.toFixed(1), r: 7 });
      nodesGroup!.appendChild(nodeStop1);

      horizTable = setPathAndSample(horizGhost!, horizDrawn!, buildHorizWavePath(entryX, horizLineY, stationRelX, vh), 12);

      for (const sx of stationRelX) {
        const g = svgEl('g');
        const c = svgEl('circle', { class: 'node-circle horiz-node-circle', cx: sx.toFixed(1), cy: horizLineY.toFixed(1), r: 9 });
        g.append(svgEl('circle', { class: 'project-ring', cx: sx.toFixed(1), cy: horizLineY.toFixed(1), r: 15 }), c);
        hCircles.push(c);
        hReachedState.push(false);
        horizNodes!.appendChild(g);
      }

      const stop4Section = byId('stop-4')!;
      const stop4Card = document.querySelector('#stop-4 .recap-wide-grid') || stop4Anchor;
      const stop3Pt = rectCenter(stop3Anchor, wRect);
      const stop4Pt = { x: rectCenter(stop4Anchor, wRect).x, y: rectCenter(stop4Card, wRect).y };
      bottomPts = [stop3Pt, stop4Pt];

      const botStartX = Math.max(60, Math.min(wrapperW - 60, exitScreenX));
      const bMid1 = (stop2BottomY + stop3Pt.y) * 0.5;
      const stop4EntryY = Math.max(stop3Pt.y + 80, stop4Section.getBoundingClientRect().top - wRect.top + 24);
      const bMid2 = (stop3Pt.y + stop4EntryY) * 0.5;

      botTable = setPathAndSample(
        ghostBottom!,
        drawnBottom!,
        `M ${botStartX.toFixed(1)} ${stop2BottomY.toFixed(1)} C ${botStartX.toFixed(1)} ${bMid1.toFixed(1)}, ${stop3Pt.x.toFixed(1)} ${bMid1.toFixed(1)}, ${stop3Pt.x.toFixed(1)} ${stop3Pt.y.toFixed(1)} C ${stop3Pt.x.toFixed(1)} ${bMid2.toFixed(1)}, ${stop4Pt.x.toFixed(1)} ${bMid2.toFixed(1)}, ${stop4Pt.x.toFixed(1)} ${stop4EntryY.toFixed(1)} L ${stop4Pt.x.toFixed(1)} ${stop4Pt.y.toFixed(1)}`,
        10,
      );

      nodeStop3 = svgEl('circle', { class: 'node-circle', cx: stop3Pt.x.toFixed(1), cy: stop3Pt.y.toFixed(1), r: 8 });
      nodeStop4 = svgEl('circle', { class: 'node-circle', cx: stop4Pt.x.toFixed(1), cy: stop4Pt.y.toFixed(1), r: 8 });
      nodesGroup!.append(nodeStop3, nodeStop4);

      for (const { label, angle } of SKILL_BRANCHES) {
        const rad = ((180 + angle) * Math.PI) / 180;
        const ex = stop3Pt.x + 56 * Math.cos(rad);
        const ey = stop3Pt.y + 56 * Math.sin(rad);
        const bg = svgEl('g', { class: `branch-group${skillsBranchesDrawn ? ' is-drawn' : ''}` });
        const p = svgEl('path', {
          class: 'branch-path',
          d: `M ${stop3Pt.x.toFixed(1)} ${stop3Pt.y.toFixed(1)} Q ${(stop3Pt.x + (ex - stop3Pt.x) * 0.5).toFixed(1)} ${(stop3Pt.y + (ey - stop3Pt.y) * 0.5).toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`,
        });
        const t = svgEl('text', { class: 'branch-label', x: (ex - 8).toFixed(1), y: (ey + 4).toFixed(1), 'text-anchor': 'end' });
        t.textContent = label;
        bg.append(p, svgEl('circle', { class: 'branch-dot', cx: ex.toFixed(1), cy: ey.toFixed(1), r: 2.5 }), t);
        branchesGroup!.appendChild(bg);
        const bl = p.getTotalLength();
        p.style.strokeDasharray = String(bl);
        p.style.strokeDashoffset = skillsBranchesDrawn ? '0' : String(bl);
        skillBranchEls.push(bg);
      }
    }

    function render(scrollY: number) {
      rafPending = false;
      const vh = window.innerHeight;
      const docY = scrollY + vh * CONFIG.tipPosition;

      if (!isDesktopHoriz) {
        const s = lookupPath(topTable, 'Y', docY);
        clipRectTop!.setAttribute('height', s.y.toFixed(1));
        tipCircle!.setAttribute('cx', s.x.toFixed(1));
        tipCircle!.setAttribute('cy', s.y.toFixed(1));
        return;
      }

      const detourScrollRange = Math.max(1, stop2BottomY - stop2TopY - vh);
      if (docY >= stop1Pt.y - vh * CONFIG.textLead) stop1Txt?.classList.add('is-visible');
      nodeStop1?.classList.toggle('is-reached', docY >= stop1Pt.y);

      if (scrollY < stop2TopY) {
        track!.style.transform = 'translate3d(0px, 0, 0)';
        const sTop = lookupPath(topTable, 'Y', docY);
        clipRectTop!.setAttribute('height', sTop.y.toFixed(1));
        clipRectHoriz!.setAttribute('width', '0');
        clipRectHoriz!.setAttribute('height', '0');
        clipRectBottom!.setAttribute('height', '0');
        tipCircle!.style.opacity = '1';
        horizTip!.style.opacity = '0';
        tipCircle!.setAttribute('cx', sTop.x.toFixed(1));
        tipCircle!.setAttribute('cy', sTop.y.toFixed(1));
        setHudText(docY >= stop1Pt.y ? 'stop 1/4 · intro' : 'stop 0/4');
      } else if (scrollY <= stop2TopY + detourScrollRange) {
        clipRectTop!.setAttribute('height', String(stop2TopY + 10));
        clipRectBottom!.setAttribute('height', '0');

        const u = Math.max(0, Math.min(1, (scrollY - stop2TopY) / detourScrollRange));
        const slideU = Math.min(1, u / CONFIG.slidePortion);
        const dwellU = u <= CONFIG.slidePortion ? 0 : (u - CONFIG.slidePortion) / (1 - CONFIG.slidePortion);

        track!.style.transform = `translate3d(${-(slideU * maxTrackTx).toFixed(1)}px, 0, 0)`;
        const curTrackX = stationRelX[0] + slideU * (exitTrackX - stationRelX[0]);

        tipCircle!.style.opacity = '0';
        horizTip!.style.opacity = '1';

        if (dwellU <= 0) {
          const sHoriz = lookupPath(horizTable, 'X', curTrackX);
          clipRectHoriz!.setAttribute('width', (sHoriz.x + 6).toFixed(1));
          clipRectHoriz!.setAttribute('height', (horizLineY + 28).toFixed(1));
          horizTip!.setAttribute('cx', sHoriz.x.toFixed(1));
          horizTip!.setAttribute('cy', sHoriz.y.toFixed(1));
        } else {
          const downY = horizLineY + dwellU * (vh - horizLineY);
          clipRectHoriz!.setAttribute('width', (exitTrackX + 20).toFixed(1));
          clipRectHoriz!.setAttribute('height', downY.toFixed(1));
          horizTip!.setAttribute('cx', exitTrackX.toFixed(1));
          horizTip!.setAttribute('cy', downY.toFixed(1));
        }

        let activeStationIdx = 0;
        for (let idx = 0; idx < stationRelX.length; idx++) {
          const reached = curTrackX >= stationRelX[idx] - 12;
          if (reached) activeStationIdx = idx;
          if (hReachedState[idx] !== reached) {
            hReachedState[idx] = reached;
            hCircles[idx]?.classList.toggle('is-reached', reached);
          }
        }

        const total = featuredProjects.length;
        const shown = Math.min(total, activeStationIdx + 1);
        setCounterText(activeStationIdx >= total ? 'all repositories' : `project ${shown} / ${total}`);
        setHudText(activeStationIdx >= total ? 'stop 2/4 · all repositories' : `stop 2/4 · project ${shown}/${total}`);
      } else {
        clipRectTop!.setAttribute('height', String(stop2TopY + 10));
        clipRectHoriz!.setAttribute('width', String(exitTrackX + 40));
        clipRectHoriz!.setAttribute('height', String(vh + 20));
        track!.style.transform = `translate3d(${-maxTrackTx.toFixed(1)}px, 0, 0)`;

        const sBot = lookupPath(botTable, 'Y', docY);
        clipRectBottom!.setAttribute('height', sBot.y.toFixed(1));
        tipCircle!.style.opacity = '1';
        horizTip!.style.opacity = '0';
        tipCircle!.setAttribute('cx', sBot.x.toFixed(1));
        tipCircle!.setAttribute('cy', sBot.y.toFixed(1));

        const [stop3Pt, stop4Pt] = bottomPts;
        nodeStop3?.classList.toggle('is-reached', docY >= stop3Pt.y);
        nodeStop4?.classList.toggle('is-reached', docY >= stop4Pt.y);

        if (docY >= stop3Pt.y - vh * CONFIG.textLead && stop3Txt) {
          stop3Txt.classList.add('is-visible');
          if (!skillsBranchesDrawn) {
            skillsBranchesDrawn = true;
            skillBranchEls.forEach((el, si) => window.setTimeout(() => el.classList.add('is-drawn'), si * 75));
          }
        }
        if (docY >= stop4Pt.y - vh * CONFIG.textLead) stop4Txt?.classList.add('is-visible');
        setHudText(docY >= stop4Pt.y ? 'end of the line' : 'stop 3/4 · skills');
      }
    }

    const onScroll = () => {
      if (!userScrolled) {
        userScrolled = true;
        scrollHint?.classList.remove('is-visible');
        scrollHint?.classList.add('is-dismissed');
      }
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => render(window.scrollY || window.pageYOffset || 0));
      }
    };

    const onResize = () => {
      measure();
      render(window.scrollY || window.pageYOffset || 0);
    };

    document.querySelectorAll('.project-station .txt').forEach((el) => el.classList.add('is-visible'));
    onResize();

    const introTimer = window.setTimeout(() => stop1Txt?.classList.add('is-visible'), CONFIG.introDelayMs);
    const hintTimer = window.setTimeout(() => {
      if (!userScrolled) scrollHint?.classList.add('is-visible');
    }, CONFIG.hintDelayMs);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.fonts?.ready?.then(onResize);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(hintTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [wrapperRef]);
}
