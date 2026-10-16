'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ExternalLink } from '@/components/ui/primitives';
import { RECAP_STOPS, SOCIAL_LINKS } from '@/lib/site-data';

export function RecapStop() {
  const [copied, setCopied] = useState(false);

  const copyEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navigator.clipboard?.writeText) return;
    e.preventDefault();
    navigator.clipboard
      .writeText('joshiakshit108@gmail.com')
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      })
      .catch(() => {});
  };

  const scrollToStop = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="stop-4" className="stop stop-recap" aria-labelledby="recap-title">
      <div className="anchor" data-stop="recap"></div>
      <div className="txt recap-txt">
        <p className="stop-tag">END OF THE LINE</p>
        <h2 id="recap-title" className="recap-lead">
          Building systems that people will actually use.
        </h2>

        <div className="recap-wide-grid">
          <div className="contact-block">
            <span className="recap-col-label">DIRECT DISPATCH</span>
            <a
              id="email-action"
              className="email-action"
              href="mailto:joshiakshit108@gmail.com"
              onClick={copyEmail}
            >
              {copied ? 'copied to clipboard' : 'joshiakshit108@gmail.com'}
            </a>
            <div className="secondary-links">
              {SOCIAL_LINKS.map((link) => {
                const cls = `meta-link${link.accent ? ' meta-link-accent' : ''}`;
                return link.external ? (
                  <ExternalLink key={link.label} href={link.href} className={cls}>
                    {link.label}
                  </ExternalLink>
                ) : (
                  <Link key={link.label} href={link.href} className={cls}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <nav className="route-recap" aria-label="Route map">
            <span className="recap-col-label">ROUTE LOG</span>
            <ol className="recap-list">
              {RECAP_STOPS.map((item) => {
                const content = (
                  <>
                    <span className="recap-title">{item.title}</span>
                    <span className="recap-sep" aria-hidden="true">
                      —
                    </span>
                    <span className="recap-desc">{item.desc}</span>
                  </>
                );
                return (
                  <li key={item.title} className="recap-row">
                    {'id' in item ? (
                      <a
                        href={`#${item.id}`}
                        className="recap-link"
                        onClick={(e) => scrollToStop(e, item.id)}
                      >
                        {content}
                      </a>
                    ) : (
                      <Link href={item.href} className="recap-link">
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
