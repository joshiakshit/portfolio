import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageShell } from '@/components/ui/page-shell';
import { getAllPosts, getPost } from '@/lib/posts';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { meta } = getPost(slug);
    return { title: meta.title, description: meta.description };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }

  return (
    <PageShell
      tag={`DISPATCH  ·  ${post.meta.date}`}
      title={post.meta.title}
      subtitle={post.meta.description}
      footer={
        <>
          <Link href="/blog" className="portal-primary-btn">
            ← all notes
          </Link>
          <Link href="/" className="stop-link">
            return to route ↗
          </Link>
        </>
      }
    >
      <article className="blog-article-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
    </PageShell>
  );
}
