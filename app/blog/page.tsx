import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export const metadata = { title: 'blog', description: 'writing by ash' };

export default function Blog() {
  const posts = getAllPosts();
  return (
    <>
      <main>
        <div className="projects-header">
          <Link href="/" className="back">← back</Link>
          <h1>blog</h1>
        </div>
        <ul className="project-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`}>
                <span className="proj-name">{p.title}</span>
                <span className="proj-desc">{p.date}</span>
                <span className="proj-arrow">→</span>
              </Link>
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
