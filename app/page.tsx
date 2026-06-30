import Link from 'next/link';
import { LandingLock } from './landing-lock';

export default function Home() {
  return (
    <>
      <LandingLock />
      <main>
        <h1>ash<span className="cursor" /></h1>
        <p className="tagline">builds stuff</p>
        <div className="spacer" />
        <nav>
          <ul>
            <li><Link href="/projects">projects</Link></li>
            <li><Link href="/blog">blog</Link></li>
            <li><a href="https://linkedin.com/in/joshiakshit" target="_blank" rel="noopener noreferrer">contact</a></li>
          </ul>
        </nav>
      </main>
      <footer>
        <nav>
          <ul>
            <li><a href="https://github.com/joshiakshit" target="_blank" rel="noopener noreferrer">github</a></li>
            <li><a href="https://linkedin.com/in/joshiakshit" target="_blank" rel="noopener noreferrer">linkedin</a></li>
          </ul>
        </nav>
        <span className="footnote">~172kb</span>
      </footer>
    </>
  );
}
