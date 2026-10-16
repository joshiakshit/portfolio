import type { ReactNode } from 'react';
import type { ProjectId } from '@/lib/project-catalog';

const GLYPHS: Record<string, ReactNode> = {
  axis: (
    <>
      <rect x="54" y="7" width="52" height="86" rx="9" />
      <path d="M72 13h16m-23 60h30m-30 8h20" />
      <circle cx="80" cy="46" r="16" />
      <path d="m72 46 6 6 12-13" />
    </>
  ),
  'auth-service': (
    <>
      <circle cx="80" cy="48" r="37" strokeDasharray="2 5" />
      <path d="M65 45V31a15 15 0 0 1 30 0v14" />
      <rect x="56" y="44" width="48" height="35" rx="6" />
      <circle cx="80" cy="58" r="4" />
      <path d="M80 62v7" />
    </>
  ),
  'electronic-warfare': (
    <>
      <path d="M20 15v65h120M25 63h110" />
      {[22, 43, 31, 57, 18, 48, 37].map((h, i) => (
        <rect key={i} x={30 + i * 15} y={76 - h} width="8" height={h} />
      ))}
      <rect x="71" y="11" width="18" height="72" strokeDasharray="3 4" />
    </>
  ),
  music: (
    <>
      {[20, 35, 58, 27, 70, 45, 58, 35, 15].map((h, i) => (
        <path key={i} d={`M${32 + i * 12} ${48 - h / 2}v${h}`} />
      ))}
      <path d="M30 87h100" />
    </>
  ),
  impromptu: (
    <>
      <path d="m29 22 83-7 5 58-83 7Z" />
      <path d="m43 38 51-4m-49 15 44-4m-43 15 31-3" />
      <circle cx="119" cy="72" r="20" />
      <path d="M119 59v13l7 4" />
    </>
  ),
  'table-stakes': (
    <>
      <ellipse cx="80" cy="57" rx="60" ry="29" />
      <rect x="44" y="18" width="26" height="38" rx="3" transform="rotate(-14 44 18)" />
      <rect x="74" y="14" width="26" height="38" rx="3" transform="rotate(8 74 14)" />
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx="100" cy={62 - i * 5} rx="14" ry="5" />
      ))}
    </>
  ),
};

const DEFAULT_GLYPH = (
  <>
    <rect x="28" y="20" width="104" height="60" rx="8" />
    <path d="M48 42h64M48 58h42" />
    <circle cx="112" cy="58" r="6" />
  </>
);

export function ProjectGlyph({ id }: { id: ProjectId }) {
  return (
    <svg className="project-glyph" viewBox="0 0 160 100" fill="none" aria-hidden="true">
      {GLYPHS[id] ?? DEFAULT_GLYPH}
    </svg>
  );
}
