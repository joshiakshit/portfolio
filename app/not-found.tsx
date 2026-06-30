import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <div className="projects-header">
        <Link href="/" className="back">← back</Link>
        <h1>404</h1>
      </div>
      <p className="tagline">that page doesn&apos;t exist.</p>
    </main>
  );
}
