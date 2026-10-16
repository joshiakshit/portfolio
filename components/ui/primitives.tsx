import Link from 'next/link';
import type { ReactNode } from 'react';

export function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export function StopHeader({
  tag,
  title,
  titleId,
  headingAs = 'h2',
  lead,
  body,
}: {
  tag: string;
  title: string;
  titleId?: string;
  headingAs?: 'h1' | 'h2';
  lead?: string;
  body?: string;
}) {
  const Heading = headingAs;
  return (
    <>
      <p className="stop-tag">{tag}</p>
      <Heading id={titleId} className="stop-title">
        {title}
      </Heading>
      {lead && <p className="stop-lead">{lead}</p>}
      {body && <p className="stop-body">{body}</p>}
    </>
  );
}

export function SchematicCard({
  leftLabel,
  rightLabel,
  viewBox,
  className = '',
  children,
}: {
  leftLabel: string;
  rightLabel: string;
  viewBox: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`anchor-schematic ${className}`.trim()} aria-hidden="true">
      <div className="schematic-header">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <svg viewBox={viewBox} className="schematic-svg">
        {children}
      </svg>
    </div>
  );
}

export function ArchiveRow({
  href,
  external = false,
  title,
  description,
  date,
  badge,
  arrow = '↗',
}: {
  href: string;
  external?: boolean;
  title: string;
  description: string;
  date?: string;
  badge: string;
  arrow?: string;
}) {
  const inner = (
    <>
      <div className="repo-main">
        <h3>
          {title} <span aria-hidden="true">{arrow}</span>
        </h3>
        <p>{description}</p>
      </div>
      <div className="repo-meta">
        {date && <span>{date}</span>}
        <span className="repo-lang-tag">{badge}</span>
      </div>
    </>
  );

  return (
    <li className="repo-row">
      {external ? (
        <ExternalLink href={href}>{inner}</ExternalLink>
      ) : (
        <Link href={href}>{inner}</Link>
      )}
    </li>
  );
}
