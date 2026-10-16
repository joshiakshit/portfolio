'use client';

import { useEffect, useRef } from 'react';

type MicroDoodle = {
  x: number;
  y: number;
  type: number;
  angle: number;
  scale: number;
  hexTxt: string;
};

const HEX_LABELS = ['0x7F', '0x1A', 'ACK', 'SYN', 'TTL', '01', 'FF', 'JWT', 'SNR', 'EOF'];

const POLY_DOODLES: Record<number, number[][][]> = {
  1: [
    [[-3.5, 0], [3.5, 0]],
    [[0, -3.5], [0, 3.5]],
  ],
  3: [[[-6, 0], [-3.5, -2.8], [-1.2, 2.8], [1.2, -2.8], [3.5, 2.8], [6, 0]]],
  6: [
    [[-5, 0], [4, 0]],
    [[1.5, -2.5], [4.5, 0], [1.5, 2.5]],
  ],
  7: [
    [[-3.5, 3], [-3.5, -1]],
    [[0, 3], [0, -4]],
    [[3.5, 3], [3.5, 0]],
  ],
  8: [[[0, -4], [4, 0], [0, 4], [-4, 0], [0, -4]]],
  10: [
    [[-2, -3], [-5, 0], [-2, 3]],
    [[2, -3], [5, 0], [2, 3]],
  ],
};

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function drawMicroDoodle(ctx: CanvasRenderingContext2D, d: MicroDoodle, s: number) {
  ctx.save();
  ctx.scale(s, s);

  const poly = POLY_DOODLES[d.type];
  if (poly) {
    ctx.beginPath();
    for (const seg of poly) {
      ctx.moveTo(seg[0][0], seg[0][1]);
      for (let i = 1; i < seg.length; i++) ctx.lineTo(seg[i][0], seg[i][1]);
    }
    ctx.stroke();
    ctx.restore();
    return;
  }

  switch (d.type) {
    case 0:
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.quadraticCurveTo(-3, -4, 0, 0);
      ctx.quadraticCurveTo(3, 4, 6, 0);
      ctx.stroke();
      break;
    case 2:
      ctx.beginPath();
      ctx.arc(-4.5, 0, 1.5, 0, Math.PI * 2);
      ctx.moveTo(-3, 0);
      ctx.lineTo(3, 0);
      ctx.arc(4.5, 0, 1.5, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 4:
      ctx.strokeRect(-3.5, -1, 7, 5.5);
      ctx.beginPath();
      ctx.arc(0, -1, 2.2, Math.PI, 0);
      ctx.stroke();
      break;
    case 5:
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(d.hexTxt, 0, 0);
      break;
    case 9:
      ctx.beginPath();
      ctx.moveTo(-4, -3.5);
      ctx.lineTo(0, -3.5);
      ctx.arc(0, 0, 3.5, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(-4, 3.5);
      ctx.closePath();
      ctx.stroke();
      break;
    default:
      ctx.beginPath();
      ctx.arc(0, 0, 3.2, 0, Math.PI * 1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  ctx.restore();
}

export default function DoodleCanvas() {
  const staticCanvasRef = useRef<HTMLCanvasElement>(null);
  const hoverCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const staticCanvas = staticCanvasRef.current;
    const hoverCanvas = hoverCanvasRef.current;
    if (!staticCanvas || !hoverCanvas) return;

    const staticCtx = staticCanvas.getContext('2d', { alpha: true });
    const hoverCtx = hoverCanvas.getContext('2d', { alpha: true });
    if (!staticCtx || !hoverCtx) return;

    let width = 0;
    let height = 0;
    let cellSize = 40;
    let cols = 0;
    let rows = 0;
    let grid: MicroDoodle[][] = [];

    let mouseX = -9999;
    let mouseY = -9999;
    let prevClearX = -9999;
    let prevClearY = -9999;
    let rafPending = false;
    let isScrolling = false;
    let scrollIdleTimer = 0;

    function isDarkTheme(): boolean {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'dark') return true;
      if (attr === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function paintStaticField() {
      const isDark = isDarkTheme();
      const color = isDark ? 'rgba(236, 231, 218, 0.125)' : 'rgba(27, 27, 24, 0.105)';

      staticCtx!.clearRect(0, 0, width, height);
      staticCtx!.lineWidth = 1.05;
      staticCtx!.lineCap = 'round';
      staticCtx!.lineJoin = 'round';
      staticCtx!.strokeStyle = color;
      staticCtx!.fillStyle = color;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const d = grid[r][c];
          staticCtx!.save();
          staticCtx!.translate(d.x, d.y);
          staticCtx!.rotate(d.angle);
          drawMicroDoodle(staticCtx!, d, d.scale);
          staticCtx!.restore();
        }
      }
    }

    function buildField() {
      width = window.innerWidth;
      height = window.innerHeight;
      staticCanvas!.width = width;
      staticCanvas!.height = height;
      hoverCanvas!.width = width;
      hoverCanvas!.height = height;

      cellSize = width < 700 ? 44 : 38;
      cols = Math.ceil(width / cellSize) + 1;
      rows = Math.ceil(height / cellSize) + 1;

      grid = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const seed = r * 131 + c * 17 + 7;
          const h1 = hash(seed);
          const h2 = hash(seed + 13);
          return {
            x: (c + 0.18 + h1 * 0.64) * cellSize,
            y: (r + 0.18 + h2 * 0.64) * cellSize,
            type: Math.floor(hash(seed + 29) * 12),
            angle: (hash(seed + 53) - 0.5) * 1.1,
            scale: 0.72 + h1 * 0.45,
            hexTxt: HEX_LABELS[Math.floor(h2 * HEX_LABELS.length)],
          };
        }),
      );

      paintStaticField();
    }

    function renderHoverPatch() {
      rafPending = false;
      const radius = 125;
      const clearPad = radius + 24;

      if (prevClearX > -1000) {
        hoverCtx!.clearRect(
          Math.max(0, prevClearX - clearPad),
          Math.max(0, prevClearY - clearPad),
          clearPad * 2,
          clearPad * 2,
        );
      }

      if (isScrolling || mouseX < -100 || mouseY < -100) {
        prevClearX = -9999;
        prevClearY = -9999;
        return;
      }

      prevClearX = mouseX;
      prevClearY = mouseY;

      const accentRgb = isDarkTheme() ? '255, 122, 77' : '194, 58, 23';
      hoverCtx!.lineWidth = 1.15;
      hoverCtx!.lineCap = 'round';
      hoverCtx!.lineJoin = 'round';

      const cellRadius = Math.ceil(radius / cellSize);
      const centerCol = Math.floor(mouseX / cellSize);
      const centerRow = Math.floor(mouseY / cellSize);
      const r2 = radius * radius;

      const rMin = Math.max(0, centerRow - cellRadius);
      const rMax = Math.min(rows - 1, centerRow + cellRadius);
      const cMin = Math.max(0, centerCol - cellRadius);
      const cMax = Math.min(cols - 1, centerCol + cellRadius);

      for (let r = rMin; r <= rMax; r++) {
        for (let c = cMin; c <= cMax; c++) {
          const d = grid[r][c];
          const dx = d.x - mouseX;
          const dy = d.y - mouseY;
          const dist2 = dx * dx + dy * dy;
          if (dist2 >= r2 || dist2 < 0.01) continue;

          const dist = Math.sqrt(dist2);
          const factor = 1 - dist / radius;
          if (factor <= 0.05) continue;

          const alpha = Math.min(0.7, 0.2 + factor * 0.5).toFixed(2);
          const color = `rgba(${accentRgb}, ${alpha})`;

          hoverCtx!.save();
          hoverCtx!.translate(d.x + (dx / dist) * factor * 4, d.y + (dy / dist) * factor * 4);
          hoverCtx!.rotate(d.angle + factor * 0.3);
          hoverCtx!.strokeStyle = color;
          hoverCtx!.fillStyle = color;
          drawMicroDoodle(hoverCtx!, d, d.scale * (1 + factor * 0.22));
          hoverCtx!.restore();
        }
      }
    }

    const requestHover = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(renderHoverPatch);
      }
    };

    buildField();

    const onMouseMove = (e: MouseEvent) => {
      if (isScrolling) return;
      mouseX = e.clientX;
      mouseY = e.clientY;
      requestHover();
    };

    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      requestHover();
    };

    const onScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        requestHover();
      }
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        isScrolling = false;
      }, 120);
    };

    const onThemeChange = () => {
      paintStaticField();
      requestHover();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', buildField);
    window.addEventListener('ash-theme-change', onThemeChange);

    return () => {
      window.clearTimeout(scrollIdleTimer);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', buildField);
      window.removeEventListener('ash-theme-change', onThemeChange);
    };
  }, []);

  return (
    <>
      <canvas ref={staticCanvasRef} id="doodle-canvas" className="doodle-canvas" aria-hidden="true" />
      <canvas ref={hoverCanvasRef} className="doodle-canvas" aria-hidden="true" />
    </>
  );
}
