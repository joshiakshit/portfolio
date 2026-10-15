export type Point = [number, number, number];
export type Edge = { a: number; b: number; part: number; weight: number };
export type Face = { vertices: number[]; part: number };
export const TAU = Math.PI * 2;
export { TRANSITION_START, clamp, smooth, transitionAt } from './story-progress';
export const rings = [
  { radius: 160, width: 13, x: .88, y: -.48, z: -.4, speed: .034 },
  { radius: 139, width: 10, x: -.65, y: .6, z: .7, speed: -.044 },
  { radius: 117, width: 8, x: 1.3, y: -.85, z: .2, speed: .05 },
  { radius: 96, width: 6, x: .35, y: 1.05, z: -.65, speed: -.058 },
  { radius: 76, width: 5, x: -1.05, y: -.3, z: .4, speed: .066 },
  { radius: 61, width: 4, x: .7, y: .75, z: 1, speed: -.074 },
  { radius: 48, width: 3, x: -.4, y: 1.2, z: -.8, speed: .082 },
  { radius: 38, width: 2.5, x: 1.1, y: .2, z: .65, speed: -.09 },
];

export const CORE_PART=rings.length;

export function rotation(x: number, y: number, z: number): (p: Point) => Point {
  const cy=Math.cos(y),sy=Math.sin(y),cx=Math.cos(x),sx=Math.sin(x),cz=Math.cos(z),sz=Math.sin(z);
  return (p: Point) => {
    const yy=p[1]*cx-p[2]*sx, zz=p[1]*sx+p[2]*cx;
    const xx=p[0]*cy+zz*sy, zzz=-p[0]*sy+zz*cy;
    return [xx*cz-yy*sz,xx*sz+yy*cz,zzz];
  };
}
export function outlineCircle(x:number,y:number,rx:number,ry:number):Point[] { return Array.from({length:97},(_,i)=>[x+Math.cos(i/96*TAU)*rx,y+Math.sin(i/96*TAU)*ry,0]); }
function rect(x:number,y:number,w:number,h:number):Point[] { return [[x,y,0],[x+w,y,0],[x+w,y+h,0],[x,y+h,0],[x,y,0]]; }
const note=rect(-181,-92,310,156);
const bars=Array.from({length:20},(_,i)=>{const x=-177+i*18.5,h=25+Math.sin(i*2.1)**2*100;return [[x,-h/2-15,0],[x,h/2-15,0]] as Point[];});
const chips=(x:number)=>Array.from({length:4},(_,j)=>outlineCircle(x,40-j*9,22,8));
const originalShapes:Point[][][][]=[
  [[outlineCircle(163,61,31,31)],[outlineCircle(163,61,26,26)],[note],[rect(-174,-85,296,142)],[[[-155,-45,0],[71,-45,0]],[[-155,-5,0],[45,-5,0]]],[[[-155,22,0],[28,22,0]],[[-145,31,0],[15,31,0]]],[[[155,55,0],[168,55,0],[168,65,0],[155,65,0]]],[[[-180,128,0],[-90,128,0]]]],
  [[outlineCircle(0,35,177,70)],[outlineCircle(0,35,164,60)],[rect(-124,-90,62,90)],[rect(-48,-75,62,90)],chips(-12),[...chips(38),...chips(88)],[[[-110,-60,0],[-100,-75,0],[-90,-60,0]]],[[[-170,130,0],[-100,130,0]]]],
  [[bars.flat()],[...Array.from({length:8},(_,i)=>rect(-177+i*46,84,34,28))],bars.slice(0,7),bars.slice(7,14),bars.slice(14),[[[-177,60,0],[177,60,0]]],[[[-160,131,0],[-160,144,0],[-147,137,0],[-160,131,0]]],[[[90,137,0],[175,137,0]]]],
];
const phone:Point[][][]=[
  [rect(-86,-132,172,253)], [outlineCircle(0,-29,43,43)], [rect(-70,48,140,24)], [rect(-70,79,140,24)],
  [[[-53,-99,0],[9,-99,0]]], [outlineCircle(0,-29,36,36)], [[[-40,-120,0],[40,-120,0]]], [[[-65,116,0],[65,116,0]]],
];
const lock:Point[][][]=[
  [outlineCircle(0,-20,83,83)], [outlineCircle(0,-20,74,74)], [rect(-44,-27,88,64)],
  [[[-27,-27,0],[-27,-52,0],[-20,-73,0],[0,-80,0],[20,-73,0],[27,-52,0],[27,-27,0]]],
  [rect(-156,65,52,27)], [rect(-26,65,52,27)], [rect(104,65,52,27)], [[[-130,78,0],[130,78,0]]],
];
const spectrum:Point[][][]=[
  [[[-163,-105,0],[-163,68,0],[163,68,0]]], [rect(-40,-102,32,169)],
  ...Array.from({length:6},(_,i)=>{const x=-153+i*48,h=45+(i%3)*33;return [rect(x,65-h,24,h)];}),
];
const expand=(parts:Point[][][]):Point[][][]=>[...parts.slice(0,6),parts[0],parts[1],parts[6],parts[7]];
const decorate=(parts:Point[][][]):Point[][][]=>[...parts,[outlineCircle(0,-20,6,6)],[[[-90,125,0],[90,125,0]]]];
// Same order as the portfolio: Auth Service, Electronic Warfare, Axis, Music, Impromptu, Table Stakes.
const shapes=[decorate(lock),decorate(spectrum),decorate(phone),expand(originalShapes[2]),expand(originalShapes[0]),expand(originalShapes[1])];
// Equal segment counts let one clean outline interpolate into the next.
// Subdivide each original segment separately so corners never get rounded off.
export const lineTargets = shapes.map(parts => {
  const segments=parts.flat().flatMap(path=>path.slice(1).map((b,i)=>({a:path[i],b,length:Math.hypot(b[0]-path[i][0],b[1]-path[i][1])}))).filter(segment=>segment.length>0);
  const total=segments.reduce((sum,segment)=>sum+segment.length,0);
  const counts=segments.map(segment=>1+Math.floor(segment.length/total*(2048-segments.length)));
  const remaining=2048-counts.reduce((sum,count)=>sum+count,0);
  for(let i=0;i<remaining;i++)counts[i%counts.length]++;
  return segments.flatMap((segment,index)=>Array.from({length:counts[index]},(_,i)=>{
    const at=(fraction:number):Point=>segment.a.map((value,axis)=>value+(segment.b[axis]-value)*fraction) as Point;
    return [at(i/counts[index]),at((i+1)/counts[index])] as [Point,Point];
  }));
});
