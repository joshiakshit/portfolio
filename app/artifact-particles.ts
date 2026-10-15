import { CORE_PART, Point, rings, TAU } from './artifact-geometry';

export type Particle = { point: Point; part: number; seed: number; radius: number; opacity: number; color: number; field: [number, number] };
const random=(n:number)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const gaussian=(n:number)=>Math.sqrt(-2*Math.log(Math.max(.00001,random(n))))*Math.cos(random(n+1)*TAU);
const particles:Particle[]=[];
function add(point:Point,part:number,key:number,strength=1){
  const seed=random(key+3),size=random(key+7),color=random(key+19);
  particles.push({point,field:[random(key+31),random(key+47)],part,seed,
    radius:size>.985?2.4+random(key+21)*1.3:size>.82?1.0+random(key+22)*.8:.28+random(key+23)*.6,
    opacity:(.25+random(key+11)*.7)*strength,color:color<.6?0:color<.78?1:color<.94?2:3});
}
// Dense streams retain a legible orbital silhouette while individual grains circulate.
rings.forEach((ring,part)=>{
  const count=part<3?1050:part<6?650:400;
  for(let i=0;i<count;i++){
    const key=part*10000+i*37,fraction=(i+random(key)*.7)/count,angle=fraction*TAU;
    const radius=ring.radius+gaussian(key+50)*(part<3?2.4:1.35);
    const z=gaussian(key+70)*1.3;
    add([Math.cos(angle)*radius,Math.sin(angle)*radius,z],part,key,part<3?1.15:.9);
  }
});
for(let i=0;i<380;i++){
  const key=300000+i*29,z=random(key)*2-1,angle=random(key+1)*TAU,r=Math.pow(random(key+2),.8)*29,plane=Math.sqrt(1-z*z);
  add([Math.cos(angle)*plane*r,z*r,Math.sin(angle)*plane*r],CORE_PART,key,.9);
}
for(let i=0;i<140;i++){
  const key=500000+i*41,part=i%rings.length,angle=random(key)*TAU,radius=rings[part].radius+gaussian(key+2)*24;
  add([Math.cos(angle)*radius,Math.sin(angle)*radius,gaussian(key+4)*17],part,key,.25);
}
// A few bright central grains give the core its small, irregular flare.
for(let i=0;i<18;i++)add([gaussian(i+600001)*2,gaussian(i+600021)*2,gaussian(i+600041)*2],CORE_PART,600000+i*17,1.15);
export const artifactParticles=particles;
