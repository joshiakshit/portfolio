import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }
  return (
    <main>
      <div className="projects-header">
        <Link href="/blog" className="back">← blog</Link>
        <h1>{post!.meta.title}</h1>
      </div>
      <p className="post-date">{post!.meta.date}</p>
      <article className="post-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post!.content}</ReactMarkdown>
      </article>
    </main>
  );
}
