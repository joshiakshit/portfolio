import Link from 'next/link';
import { getRepos } from '@/lib/github';
import ProjectCollection from './project-collection';
import SpaceBackground from '../space-background';

export const metadata={title:'projects',description:'Apps, services, and experiments by ash. Explore the projects, try their sketches, and read the source.'};

export default async function Projects() {
  const repos=await getRepos();
  return <div className="personal-site projects-site"><SpaceBackground /><a className="skip-link" href="#project-content">Skip to projects</a><header className="site-header"><Link className="wordmark" href="/" aria-label="ash home">ash<span className="wordmark-dot">.</span></Link></header><main id="project-content" className="collection-main"><div className="collection-intro"><Link className="back" href="/">← back to the orbit</Link><h1>Things I’ve built<span>.</span></h1><p>Apps, services, and experiments. Some solve a daily annoyance.<br className="collection-break" /> Others started with “I wonder how that works.”</p></div><ProjectCollection repos={repos} /></main><footer className="site-footer"><span>© {new Date().getFullYear()} ash</span><span>Always something else to figure out.</span><nav aria-label="Footer navigation"><Link href="/">home ↗</Link><Link href="/blog">blog ↗</Link><a href="https://github.com/joshiakshit" target="_blank" rel="noopener noreferrer">github ↗</a><a href="https://linkedin.com/in/joshiakshit" target="_blank" rel="noopener noreferrer">linkedin ↗</a></nav></footer></div>;
}
