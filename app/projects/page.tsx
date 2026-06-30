import Link from 'next/link';
import { getRepos } from '@/lib/github';

export const metadata = { title: 'projects', description: 'things ash has built' };

export default async function Projects() {
  const repos = await getRepos();
  return (
    <main>
      <div className="projects-header">
        <Link href="/" className="back">← back</Link>
        <h1>projects</h1>
      </div>
      <ul className="project-list">
        {repos.map((r) => (
          <li key={r.name}>
            <a href={r.html_url} target="_blank" rel="noopener noreferrer">
              <span className="proj-name">{r.name}</span>
              <span className="proj-desc">{r.description}</span>
              <span className="proj-arrow">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
