import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <div className="projects-header">
        <Link href="/" className="back">← back</Link>
        <h1>404</h1>
      </div>
      <div className="terminal-block">
        <p className="tagline">$ cd /that/page</p>
        <p className="tagline">bash: cd: /that/page: No such file or directory</p>
      </div>
    </main>
  );
}
