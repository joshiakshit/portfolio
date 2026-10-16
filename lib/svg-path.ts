export type PathSampleTable = {
  totalLen: number;
  L: Float32Array;
  X: Float32Array;
  Y: Float32Array;
};

export const EMPTY_SAMPLE_TABLE: PathSampleTable = {
  totalLen: 0,
  L: new Float32Array([0]),
  X: new Float32Array([0]),
  Y: new Float32Array([0]),
};

export function buildSampleTable(pathEl: SVGPathElement, step = 10): PathSampleTable {
  const totalLen = pathEl.getTotalLength();
  if (!totalLen || !Number.isFinite(totalLen)) return EMPTY_SAMPLE_TABLE;

  const n = Math.max(2, Math.ceil(totalLen / step) + 1);
  const L = new Float32Array(n);
  const X = new Float32Array(n);
  const Y = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const l = Math.min(totalLen, i * step);
    const pt = pathEl.getPointAtLength(l);
    L[i] = l;
    X[i] = pt.x;
    Y[i] = pt.y;
  }
  return { totalLen, L, X, Y };
}

export function lookupPath(table: PathSampleTable, axis: 'X' | 'Y' | 'L', target: number) {
  const arr = table[axis];
  const { L, X, Y } = table;
  const last = arr.length - 1;
  if (last <= 0 || target <= arr[0]) return { len: L[0], x: X[0], y: Y[0] };
  if (target >= arr[last]) return { len: L[last], x: X[last], y: Y[last] };

  let lo = 0;
  let hi = last;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  const i0 = Math.max(0, lo - 1);
  const i1 = Math.min(last, lo);
  const v0 = arr[i0];
  const v1 = arr[i1];
  const t = v1 === v0 ? 0 : (target - v0) / (v1 - v0);
  return {
    len: L[i0] + t * (L[i1] - L[i0]),
    x: X[i0] + t * (X[i1] - X[i0]),
    y: Y[i0] + t * (Y[i1] - Y[i0]),
  };
}

export function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

export function setPathAndSample(
  ghost: SVGPathElement,
  drawn: SVGPathElement,
  d: string,
  step: number,
): PathSampleTable {
  ghost.setAttribute('d', d);
  drawn.setAttribute('d', d);
  return buildSampleTable(drawn, step);
}

export function buildHorizWavePath(entryX: number, horizLineY: number, stationRelX: number[], vh: number) {
  let d = `M ${entryX.toFixed(1)} 0 L ${entryX.toFixed(1)} ${(horizLineY - 24).toFixed(1)} Q ${entryX.toFixed(1)} ${horizLineY.toFixed(1)}, ${(entryX + 24).toFixed(1)} ${horizLineY.toFixed(1)}`;
  for (let i = 1; i < stationRelX.length; i++) {
    const prevX = i === 1 ? entryX + 24 : stationRelX[i - 1];
    const curX = stationRelX[i];
    const midX = (prevX + curX) * 0.5;
    const wave = i === stationRelX.length - 1 ? 0 : i % 2 === 1 ? -12 : 12;
    d += ` C ${midX.toFixed(1)} ${(horizLineY + wave).toFixed(1)}, ${midX.toFixed(1)} ${horizLineY.toFixed(1)}, ${curX.toFixed(1)} ${horizLineY.toFixed(1)}`;
  }
  const exitX = stationRelX[stationRelX.length - 1];
  return `${d} L ${exitX.toFixed(1)} ${vh.toFixed(1)}`;
}

export function buildMobileWeavePath(
  waypoints: ReadonlyArray<{ x: number; y: number }>,
  startX: number,
): string {
  if (!waypoints.length) return '';
  let d = `M ${startX.toFixed(1)} 0`;
  let prev = { x: startX, y: 0 };
  for (const pt of waypoints) {
    const my = ((prev.y + pt.y) * 0.5).toFixed(1);
    d += ` C ${prev.x.toFixed(1)} ${my}, ${pt.x.toFixed(1)} ${my}, ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    prev = pt;
  }
  return d;
}

