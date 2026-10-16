import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildMobileWeavePath,
  buildSampleTable,
  EMPTY_SAMPLE_TABLE,
  lookupPath,
} from '../lib/svg-path.ts';

test('buildSampleTable returns EMPTY_SAMPLE_TABLE for zero-length paths', () => {
  const table = buildSampleTable({ getTotalLength: () => 0 }, 10);
  assert.equal(table, EMPTY_SAMPLE_TABLE);
  assert.equal(table.totalLen, 0);
});

test('buildSampleTable and lookupPath interpolate accurately along X and Y axes', () => {
  const mockPath = {
    getTotalLength: () => 100,
    getPointAtLength: (l) => ({ x: l * 2, y: l * 3 }),
  };

  const table = buildSampleTable(mockPath, 25);
  assert.equal(table.totalLen, 100);
  assert.equal(table.L.length, 5);

  const byY = lookupPath(table, 'Y', 150);
  assert.ok(Math.abs(byY.len - 50) < 1e-4);
  assert.ok(Math.abs(byY.x - 100) < 1e-4);
  assert.ok(Math.abs(byY.y - 150) < 1e-4);

  const byX = lookupPath(table, 'X', 75);
  assert.ok(Math.abs(byX.len - 37.5) < 1e-4);
  assert.ok(Math.abs(byX.x - 75) < 1e-4);
  assert.ok(Math.abs(byX.y - 112.5) < 1e-4);

  // Clamping at boundaries
  const below = lookupPath(table, 'Y', -20);
  assert.equal(below.y, 0);
  const above = lookupPath(table, 'X', 999);
  assert.equal(above.x, 200);
});

test('buildMobileWeavePath generates S-curve cubic Bezier segments through alternating waypoints', () => {
  assert.equal(buildMobileWeavePath([], 180), '');

  const d = buildMobileWeavePath(
    [
      { x: 90, y: 80 },
      { x: 90, y: 300 },
      { x: 270, y: 360 },
    ],
    180,
  );

  assert.equal(
    d,
    'M 180.0 0 C 180.0 40.0, 90.0 40.0, 90.0 80.0 C 90.0 190.0, 90.0 190.0, 90.0 300.0 C 90.0 330.0, 270.0 330.0, 270.0 360.0',
  );
});

