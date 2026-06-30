import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export type PostMeta = { slug: string; title: string; date: string; description: string };

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, f), 'utf8'));
      const date = data.date instanceof Date ? data.date.toISOString().split('T')[0] : String(data.date);
      return { slug, title: data.title, date, description: data.description };
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPost(slug: string) {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);
  const date = data.date instanceof Date ? data.date.toISOString().split('T')[0] : String(data.date);
  return { meta: { slug, title: data.title, date, description: data.description }, content };
}
