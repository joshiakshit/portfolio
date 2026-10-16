import Link from 'next/link';
import { ProjectSketchRenderer } from '@/app/project-sketches';
import { ExternalLink, StopHeader } from '@/components/ui/primitives';
import { type FeaturedProject, featuredProjects } from '@/lib/project-catalog';

function ProjectStationCard({ project, index }: { project: FeaturedProject; index: number }) {
  return (
    <article className="project-station" id={`proj-${project.id}`}>
      <div className="station-node-anchor"></div>
      <div className="station-grid">
        <div className="station-info txt">
          <StopHeader tag={`02.${index + 1}  ·  ${project.tag}`} title={project.name} />
          <p className="stop-summary">{project.description}</p>
          {[
            { label: 'problem', text: project.problem },
            { label: 'did', text: project.did },
          ].map(({ label, text }) => (
            <div key={label} className="project-detail">
              <span className="detail-label">{label}</span>
              <p className="detail-text">{text}</p>
            </div>
          ))}
          <p className="project-stack">{project.stack.join(' · ')}</p>
          <p className="station-catch">{project.catchNote}</p>
          <div className="project-links">
            <ExternalLink
              className="stop-link"
              href={`https://github.com/joshiakshit/${project.repo}`}
            >
              source code ↗
            </ExternalLink>
          </div>
        </div>
        <ProjectSketchRenderer project={project} />
      </div>
    </article>
  );
}

export function ProjectsDetour() {
  return (
    <section id="stop-2" className="projects-detour" aria-label="Featured Projects">
      <div id="projects-sticky" className="projects-sticky">
        <div className="detour-hud">
          <span className="detour-kicker">
            02 &nbsp;·&nbsp; SELECTED PROJECTS &nbsp;//&nbsp; HORIZONTAL DETOUR
          </span>
          <div className="detour-progress-wrap">
            <span id="detour-counter" className="detour-counter">
              project 1 / {featuredProjects.length}
            </span>
            <Link href="/projects" className="detour-all-link">
              all repositories ↗
            </Link>
          </div>
        </div>

        <div id="projects-track" className="projects-track">
          <svg id="horiz-svg" className="horiz-svg" aria-hidden="true">
            <defs>
              <clipPath id="clip-horiz">
                <rect id="clip-rect-horiz" x="0" y="0" width="0" height="0" />
              </clipPath>
            </defs>
            <path id="horiz-ghost-path" className="path-ghost"></path>
            <path
              id="horiz-drawn-path"
              className="path-drawn"
              clipPath="url(#clip-horiz)"
            ></path>
            <g id="horiz-nodes"></g>
            <circle id="horiz-tip" className="tip-marker" r="5"></circle>
          </svg>

          {featuredProjects.map((project, idx) => (
            <ProjectStationCard key={project.id} project={project} index={idx} />
          ))}

          <article className="project-station station-portal" id="proj-all-portal">
            <div className="station-node-anchor"></div>
            <div className="portal-card txt">
              <StopHeader
                tag={`02.${featuredProjects.length + 1}  ·  WORKBENCH ARCHIVE`}
                title="All Repositories"
                body="Want to inspect the rest of the workbench? Browse every public repository, experiment, and language filter on the dedicated repositories page."
              />
              <div className="portal-actions">
                <Link href="/projects" className="portal-primary-btn">
                  explore all repositories ↗
                </Link>
                <ExternalLink
                  href="https://github.com/joshiakshit?tab=repositories"
                  className="stop-link"
                >
                  github profile ↗
                </ExternalLink>
              </div>
              <p className="portal-note">
                ↓ keep scrolling — the line continues down from here toward skills &amp; contact
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
