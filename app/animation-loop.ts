// Stop scheduling frames entirely when hidden/offscreen. Reduced motion paints
// only when invalidated (resize, input, or a changed scene).
export function createAnimationLoop(
  element: HTMLElement,
  paint: (timestamp: number) => void,
  fps: () => number,
) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  let dirty = true;
  let frame = 0;
  let last = -Infinity;
  let destroyed = false;

  function schedule() {
    if (!destroyed && !frame && visible && !document.hidden && (!motion.matches || dirty)) {
      frame = requestAnimationFrame(tick);
    }
  }
  function tick(now: number) {
    frame = 0;
    if (dirty || now - last >= 1000 / fps()) {
      dirty = false;
      last = now;
      paint(now);
    }
    schedule();
  }
  function invalidate() { dirty = true; schedule(); }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    invalidate();
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(element);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  schedule();
  return {
    invalidate,
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
    },
  };
}
