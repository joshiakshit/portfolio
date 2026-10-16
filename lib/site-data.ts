export const INTRO_PILLS = [
  'backend architecture',
  'network protocols',
  'applied security',
] as const;

export const SKILL_BRANCHES = [
  { label: 'Java', angle: -45 },
  { label: 'Python', angle: -25 },
  { label: 'C', angle: -5 },
  { label: 'SQL', angle: 15 },
  { label: 'FastAPI', angle: 35 },
  { label: 'Redis', angle: 55 },
] as const;

export const SKILL_DOMAINS = [
  {
    index: '01 // LANGUAGES & LOW-LEVEL',
    name: 'Systems & Core',
    items: 'C · Java · Python · SQL · TypeScript · Kotlin',
    desc: 'Memory-conscious data structures, discrete-event simulations, and strongly typed domain logic.',
  },
  {
    index: '02 // BACKEND & INFRASTRUCTURE',
    name: 'Services & Storage',
    items: 'FastAPI · PostgreSQL · Redis · Docker · Cloudflare Workers · Linux',
    desc: 'Decoupled API design, relational schema modeling, TTL cache invalidation, and containerized deploys.',
  },
  {
    index: '03 // CYBERSEC & NETWORKING',
    name: 'Protocols & Security',
    items: 'Asymmetric JWTs · Session Revocation · RF Spectrum Modeling · TCP/IP',
    desc: 'Designing authentication flows from first principles and analyzing behavior under adversarial constraints.',
  },
] as const;

export const STACK_LAYERS = [
  {
    y: 20,
    label: 'L3 · APPLICATION & EDGE',
    sub: 'FastAPI · Jetpack Compose · Workers · Web Audio',
    accent: false,
  },
  {
    y: 86,
    label: 'L2 · STATE, AUTH & PROTOCOLS',
    sub: 'PostgreSQL · Redis TTL · Asymmetric JWT · Opus',
    accent: true,
  },
  {
    y: 152,
    label: 'L1 · SYSTEMS, KERNEL & RUNTIME',
    sub: 'C · JVM · Python · Linux · Docker · Signal Sim',
    accent: false,
  },
] as const;

export const SOCIAL_LINKS = [
  { label: 'GitHub ↗', href: 'https://www.github.com/joshiakshit', external: true, accent: false },
  { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/joshiakshit', external: true, accent: false },
  { label: 'All Repositories ↗', href: '/projects', external: false, accent: true },
  { label: 'Blog ↗', href: '/blog', external: false, accent: false },
] as const;

export const RECAP_STOPS = [
  {
    id: 'stop-1',
    title: '01 Intro',
    desc: 'Backend Engineer + Cybersecurity hobbyist',
  },
  {
    id: 'stop-2',
    title: '02 Projects (6)',
    desc: 'Auth Service, Electronic Warfare, Axis, Music, Impromptu, Table Stakes',
  },
  {
    id: 'stop-3',
    title: '03 Skills & Stack',
    desc: 'Java, Python, C, SQL, FastAPI, Redis, PostgreSQL, Linux',
  },
  {
    href: '/projects',
    title: '04 Workbench Index',
    desc: 'Browse all public GitHub repositories & language filters ↗',
  },
] as const;
