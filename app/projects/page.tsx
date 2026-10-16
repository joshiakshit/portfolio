import Link from 'next/link';
import { PageShell } from '@/components/ui/page-shell';
import { ExternalLink } from '@/components/ui/primitives';
import { getRepos } from '@/lib/github';
import ProjectCollection from './project-collection';

export const metadata = {
  title: 'repositories',
  description: 'Complete index of projects, experiments, and public GitHub repositories by ash.',
};

export default async function ProjectsPage() {
  const repos = await getRepos();

  return (
    <PageShell
      id="repos-main"
      skipLabel="Skip to repositories"
      tag="WORKBENCH  ·  ARCHIVE"
      title="Projects & Repositories"
      subtitle={
        <>
          Six curated systems &amp; product builds up top, followed by the full public workbench
          fetched from{' '}
          <ExternalLink
            href="https://github.com/joshiakshit?tab=repositories"
            className="stop-link"
          >
            github.com/joshiakshit ↗
          </ExternalLink>
          .
        </>
      }
      footer={
        <>
          <Link href="/" className="portal-primary-btn">
            ← return to main story route
          </Link>
          <ExternalLink
            href="https://github.com/joshiakshit?tab=repositories"
            className="stop-link"
          >
            view on GitHub ↗
          </ExternalLink>
        </>
      }
    >
      <ProjectCollection repos={repos} />
    </PageShell>
  );
}
