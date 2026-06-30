import Link from 'next/link';
import { getRepos } from '@/lib/github';

export const metadata = { title: 'projects', description: 'things ash has built' };

const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
};

export default async function Projects() {
  const repos = await getRepos();
  return (
    <>
      <main>
        <div className="projects-header">
          <Link href="/" className="back">← back</Link>
          <h1>projects</h1>
        </div>
        <ul className="project-list">
          {repos.map((r) => (
            <li key={r.name}>
              <a href={r.html_url} target="_blank" rel="noopener noreferrer">
                <span className="proj-name">
                  {r.language && (
                    <span
                      className="lang-dot"
                      style={{ background: langColors[r.language] ?? '#888' }}
                      title={r.language}
                    />
                  )}
                  {r.name}
                </span>
                <span className="proj-desc">{r.description}</span>
                <span className="proj-arrow">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </main>
      <footer>
        <nav>
          <ul>
            <li><a href="https://github.com/joshiakshit" target="_blank" rel="noopener noreferrer">github</a></li>
            <li><a href="https://linkedin.com/in/joshiakshit" target="_blank" rel="noopener noreferrer">linkedin</a></li>
          </ul>
        </nav>
      </footer>
    </>
  );
}
