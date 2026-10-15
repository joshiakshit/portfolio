import assert from 'node:assert/strict';
import test from 'node:test';
import { createAnimationLoop } from '../app/animation-loop.ts';

function setup(t, reduced = false) {
  let nextFrame = 0;
  let intersection;
  const frames = new Map();
  const documentEvents = new Map();
  const motionEvents = new Map();
  const motion = {
    matches: reduced,
    addEventListener: (name, callback) => motionEvents.set(name, callback),
    removeEventListener: name => motionEvents.delete(name),
  };
  const originals = new Map(['document', 'matchMedia', 'IntersectionObserver', 'requestAnimationFrame', 'cancelAnimationFrame'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  Object.assign(globalThis, {
    document: {
      hidden: false,
      addEventListener: (name, callback) => documentEvents.set(name, callback),
      removeEventListener: name => documentEvents.delete(name),
    },
    matchMedia: () => motion,
    IntersectionObserver: class {
      constructor(callback) { intersection = callback; }
      observe() {}
      disconnect() {}
    },
    requestAnimationFrame: callback => { const id = ++nextFrame; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  t.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  let paints = 0;
  const loop = createAnimationLoop({}, () => paints++, () => 30);
  const tick = now => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback(now));
  };
  return { frames, tick, loop, motion, documentEvents, motionEvents, paints: () => paints, intersect: visible => intersection([{ isIntersecting: visible }]) };
}

test('caps paints and cancels pending frames while hidden or offscreen', t => {
  const scene = setup(t);
  scene.tick(0); scene.tick(16); scene.tick(34);
  assert.equal(scene.paints(), 2);
  document.hidden = true;
  scene.documentEvents.get('visibilitychange')();
  assert.equal(scene.frames.size, 0);
  document.hidden = false;
  scene.documentEvents.get('visibilitychange')();
  assert.equal(scene.frames.size, 1);
  scene.intersect(false);
  assert.equal(scene.frames.size, 0);
  scene.loop.invalidate();
  assert.equal(scene.frames.size, 0);
  scene.intersect(true);
  scene.tick(50);
  assert.equal(scene.paints(), 3);
  scene.loop.destroy();
});

test('reduced motion paints on demand and resumes after a preference change', t => {
  const scene = setup(t, true);
  scene.tick(0);
  assert.equal(scene.frames.size, 0);
  scene.loop.invalidate(); scene.loop.invalidate();
  assert.equal(scene.frames.size, 1);
  scene.tick(10);
  assert.equal(scene.paints(), 2);
  assert.equal(scene.frames.size, 0);
  scene.motion.matches = false;
  scene.motionEvents.get('change')();
  scene.tick(20);
  assert.equal(scene.frames.size, 1);
  scene.loop.destroy();
  scene.loop.invalidate();
  assert.equal(scene.frames.size, 0);
  assert.equal(scene.documentEvents.size, 0);
  assert.equal(scene.motionEvents.size, 0);
});
