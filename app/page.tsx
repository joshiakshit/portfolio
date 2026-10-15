import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import ScrollStory from './scroll-story';
import HomeHeader from './home-header';
import SocialLinks from './social-links';

export default function Home() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="personal-site home-space">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <HomeHeader />

      <main id="main-content" className="home-main">
        <ScrollStory />
          <section className="home-notes" aria-labelledby="notes-title">
            <div className="section-heading"><h2 id="notes-title"><span aria-hidden="true">02 /</span> Notes to self (and you)</h2><Link className="text-link" href="/blog">notebook <span aria-hidden="true">↗</span></Link></div>
            <p className="section-description">Things learned, things tried, things worth writing down.</p>
            {posts.length ? <div className="note-list">{posts.map((post) => <Link className="note-entry" href={`/blog/${post.slug}`} key={post.slug}><div><h3>{post.title} <span aria-hidden="true">↗</span></h3><p>{post.description}</p></div><time dateTime={post.date}>{new Date(`${post.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}</time></Link>)}</div> : <p className="empty-notes">Nothing written down yet. Back to the editor.</p>}
          </section>

          <div className="colophon"><span aria-hidden="true">↳</span><p>This site is a project, too.<br /><span>I’ll keep adding to it as I go.</span></p><a className="text-link" href="https://github.com/joshiakshit/portfolio" target="_blank" rel="noopener noreferrer">view source ↗</a></div>
      </main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} ash</span><nav aria-label="Footer navigation"><Link href="/projects">projects ↗</Link><Link href="/blog">blog ↗</Link><SocialLinks /></nav></footer>
    </div>
  );
}
