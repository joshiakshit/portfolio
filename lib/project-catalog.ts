export type SketchKind =
  | 'auth'
  | 'warfare'
  | 'axis'
  | 'music'
  | 'impromptu'
  | 'poker'
  | 'auto';

export type FeaturedProject = {
  id: string;
  tag: string;
  name: string;
  repo: string;
  language: string;
  type: string;
  description: string;
  problem: string;
  did: string;
  catchNote: string;
  stack: readonly string[];
  sketch?: SketchKind;
};

/**
 * SINGLE SOURCE OF TRUTH FOR HIGHLIGHTED PROJECTS
 * Editing, reordering, adding, or removing items here automatically updates:
 * 1. The main page horizontal scroll detour (`app/route-story.tsx`)
 * 2. The `/projects` archive page (`app/projects/project-collection.tsx`)
 *
 * Note on `sketch`:
 * - Use one of the presets ('auth' | 'warfare' | 'axis' | 'music' | 'impromptu' | 'poker')
 * - Or omit `sketch` / set it to `'auto'` and the site will automatically generate an
 *   interactive architecture schematic from your project's `name`, `language`, and `stack`!
 */
export const featuredProjects: readonly FeaturedProject[] = [
  {
    id: 'auth-service',
    tag: '2025 · BACKEND',
    name: 'Auth Service',
    repo: 'auth-service',
    language: 'Python',
    type: 'Authentication backend',
    description:
      'A standalone FastAPI backend for tokens, verification, and sessions, built to understand auth primitives from scratch.',
    problem:
      'Understanding session management and token invalidation without leaning on third-party black boxes. Handling concurrent revocation cleanly was tricky.',
    did: 'Built an isolated FastAPI service, signed JWTs with asymmetric keys, and used Redis for instant session blacklisting decoupled from domain models.',
    catchNote:
      'the catch: Redis keys needed aggressive TTLs to prevent memory leaks during stress runs.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    sketch: 'auth',
  },
  {
    id: 'electronic-warfare',
    tag: '2024 · SIGNAL & SIMULATION',
    name: 'Electronic Warfare',
    repo: 'electronic-warfare',
    language: 'Java',
    type: 'Adaptive scanner library',
    description:
      'An adaptive radio scanner library in Java exploring how to choose which frequency band to observe under bandwidth limits and uncertainty.',
    problem:
      'Constrained receivers cannot monitor the entire radio spectrum at once. Balancing known active channels against unknown frequencies required minimizing detection lag.',
    did: 'Modeled spectrum sensing as a multi-armed bandit problem and implemented adaptive sampling strategies in Java under variable signal-to-noise ratios.',
    catchNote:
      'the catch: tuning epsilon exploration took longer than writing the simulation engine itself.',
    stack: ['Java', 'Online Learning', 'Discrete Event Sim', 'Signal Processing'],
    sketch: 'warfare',
  },
  {
    id: 'axis',
    tag: '2025 · MOBILE & EDGE',
    name: 'Axis',
    repo: 'axis',
    language: 'Kotlin',
    type: 'Android app',
    description:
      'Attendance, timetables, and QR check-in for Galgotias students. A quieter, offline-friendly way to navigate university life.',
    problem:
      'Campus portals crawl during peak morning hours when students urgently need their room number, live timetable, or attendance buffer.',
    did: 'Designed an offline-first Android app with Jetpack Compose paired with Cloudflare Workers edge caching and instant QR check-in flows.',
    catchNote:
      'the catch: reconciling background timetable diffs without clobbering offline attendance logs.',
    stack: ['Kotlin', 'Jetpack Compose', 'Cloudflare Workers', 'Local Sync'],
    sketch: 'axis',
  },
  {
    id: 'music',
    tag: '2024 · REALTIME AUDIO BOT',
    name: 'Music',
    repo: 'music',
    language: 'JavaScript',
    type: 'Discord bot',
    description:
      'A Discord bot for finding music, queueing tracks, and listening together in a voice channel with low-latency stream buffering.',
    problem:
      'Voice bots frequently stutter or corrupt queue state when multiple channel members rapidly skip, shuffle, or enqueue long playlists.',
    did: 'Built an event-driven Discord audio pipeline in JavaScript with clean queue serialization, stream pre-fetching, and automatic voice reconnects.',
    catchNote:
      'the catch: handling Opus packet backpressure when upstream streams throttle mid-song.',
    stack: ['JavaScript', 'Node.js', 'Discord Voice', 'Stream Pipelines'],
    sketch: 'music',
  },
  {
    id: 'impromptu',
    tag: '2025 · WEB AUDIO & PRIVACY',
    name: 'Impromptu',
    repo: 'impromptu',
    language: 'TypeScript',
    type: 'Browser app',
    description:
      'Random topics, a countdown timer, and a quiet browser space to practice speaking on your feet. Recordings never leave your device.',
    problem:
      'Thinking clearly on the spot takes reps, but most speaking apps require accounts and upload voice clips to remote servers.',
    did: 'Built a client-only TypeScript studio using the browser MediaRecorder API, instant topic cards, and local audio playback.',
    catchNote:
      'the catch: taming MediaRecorder audio container quirks across Safari and Firefox.',
    stack: ['TypeScript', 'Browser Web Audio', 'Zero-Server Storage'],
    sketch: 'impromptu',
  },
  {
    id: 'table-stakes',
    tag: '2024 · SHARED STATE',
    name: 'Table Stakes',
    repo: 'poker',
    language: 'JavaScript',
    type: 'Web app',
    description:
      'A digital chip and pot tracker for poker nights. Less mental arithmetic, more Texas Hold’em and Teen Patti around the table.',
    problem:
      'Card nights stall when nobody has a physical chip set or when side-pot math gets messy mid-hand.',
    did: 'Created a synchronized browser table ledger for blinds, raises, and instant pot settlements across phones.',
    catchNote:
      'the catch: guarding against simultaneous bet taps clobbering the active pot total.',
    stack: ['JavaScript', 'Shared Table State', 'Responsive UI'],
    sketch: 'poker',
  },
];

export type ProjectId = (typeof featuredProjects)[number]['id'];
