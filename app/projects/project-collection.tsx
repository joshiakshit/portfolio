'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ProjectGlyph } from '@/components/projects/project-glyph';
import { ArchiveRow, ExternalLink } from '@/components/ui/primitives';
import type { Repo } from '@/lib/github';
import { featuredProjects } from '@/lib/project-catalog';

const featuredNames = new Set<string>(
  featuredProjects.map((project) => project.repo.toLowerCase()),
);

export default function ProjectCollection({ repos }: { repos: Repo[] }) {
  const [language, setLanguage] = useState('all');
  const [search, setSearch] = useState('');

  const languages = useMemo(
    () =>
      Array.from(
        new Set(
          [
            ...repos.map((repo) => repo.language),
            ...featuredProjects.map((project) => project.language),
          ].filter((value): value is string => Boolean(value)),
        ),
      ).sort(),
    [repos],
  );

  const q = search.trim().toLowerCase();

  const featured = featuredProjects.filter((project) => {
    if (language !== 'all' && project.language !== language) return false;
    if (!q) return true;
    return `${project.name} ${project.description} ${project.stack.join(' ')}`
      .toLowerCase()
      .includes(q);
  });

  const others = repos.filter((repo) => {
    if (featuredNames.has(repo.name.toLowerCase())) return false;
    if (language !== 'all' && repo.language !== language) return false;
    if (!q) return true;
    return `${repo.name} ${repo.description ?? ''} ${repo.language ?? ''}`
      .toLowerCase()
      .includes(q);
  });

  const total = featured.length + others.length;

  return (
    <>
      <div className="collection-controls">
        <div className="lang-pills" role="group" aria-label="Filter by programming language">
          {['all', ...languages].map((lang) => (
            <button
              key={lang}
              type="button"
              className={`lang-pill ${language === lang ? 'is-active' : ''}`}
              onClick={() => setLanguage(lang)}
            >
              {lang === 'all' ? 'All languages' : lang}
            </button>
          ))}
        </div>

        <div className="repo-search-wrap">
          <input
            type="search"
            className="repo-search"
            placeholder="Filter by name, stack, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search repositories"
          />
        </div>
      </div>

      <p className="collection-count" role="status">
        {language === 'all' && !q
          ? `Showing ${featured.length} featured builds + ${others.length} public workbench repositories.`
          : `Showing ${total} matching ${total === 1 ? 'project' : 'projects'}.`}
      </p>

      {featured.length > 0 && (
        <section className="featured-collection" aria-labelledby="featured-heading">
          <div className="collection-section-heading">
            <h2 id="featured-heading">Selected Projects</h2>
            <span>01 // BUILT &amp; EXPLORED</span>
          </div>
          <div className="featured-grid">
            {featured.map((project) => {
              const repoUrl = `https://github.com/joshiakshit/${project.repo}`;
              return (
                <article className="collection-card" key={project.id}>
                  <div>
                    <div className="card-visual">
                      <span className="card-index">
                        0{featuredProjects.indexOf(project) + 1}
                      </span>
                      <ProjectGlyph id={project.id} />
                      <span className="card-type">{project.language}</span>
                    </div>
                    <div className="card-body" style={{ marginTop: '0.9rem' }}>
                      <h3>
                        <ExternalLink href={repoUrl}>
                          {project.name} <span aria-hidden="true">↗</span>
                        </ExternalLink>
                      </h3>
                      <p>{project.description}</p>
                    </div>
                  </div>
                  <div>
                    <ul className="stack-list" aria-label="Built with">
                      {project.stack.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="card-actions">
                      <Link href={`/#proj-${project.id}`}>interactive sketch →</Link>
                      <ExternalLink href={repoUrl}>source ↗</ExternalLink>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="repository-collection" aria-labelledby="repositories-heading">
        <div className="collection-section-heading">
          <h2 id="repositories-heading">More from the Workbench</h2>
          <span>02 // {others.length} REPOSITORIES</span>
        </div>
        {others.length > 0 ? (
          <ul className="repository-list">
            {others.map((repo) => (
              <ArchiveRow
                key={repo.name}
                href={repo.html_url}
                external
                title={repo.name}
                description={repo.description || 'Public repository on GitHub.'}
                date={
                  repo.updated_at
                    ? new Date(repo.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : undefined
                }
                badge={repo.language ?? 'Repo'}
              />
            ))}
          </ul>
        ) : (
          <p className="collection-count">
            Browse all public repositories directly on{' '}
            <ExternalLink
              href="https://github.com/joshiakshit?tab=repositories"
              className="stop-link"
            >
              GitHub ↗
            </ExternalLink>
            .
          </p>
        )}
      </section>
    </>
  );
}
