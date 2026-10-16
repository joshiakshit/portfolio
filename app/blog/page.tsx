import Link from 'next/link';
import { PageShell } from '@/components/ui/page-shell';
import { ArchiveRow } from '@/components/ui/primitives';
import { getAllPosts } from '@/lib/posts';

export const metadata = {
  title: 'blog',
  description: 'Writing and engineering notes by ash.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <PageShell
      tag="NOTEBOOK  ·  WRITING"
      title="Notes & Dispatches"
      subtitle="Things learned, systems built, and notes worth writing down."
      footer={
        <Link href="/" className="portal-primary-btn">
          ← return to main story route
        </Link>
      }
    >
      <section className="repository-collection" aria-label="Blog posts">
        <ul className="repository-list">
          {posts.map((post) => (
            <ArchiveRow
              key={post.slug}
              href={`/blog/${post.slug}`}
              title={post.title}
              description={post.description}
              badge={post.date}
              arrow="→"
            />
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
