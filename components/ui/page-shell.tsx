import type { ReactNode } from 'react';

export function PageShell({
  id,
  skipLabel,
  tag,
  title,
  subtitle,
  footer,
  children,
}: {
  id?: string;
  skipLabel?: string;
  tag: string;
  title: string;
  subtitle: ReactNode;
  footer: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      {id && skipLabel && (
        <a href={`#${id}`} className="skip-link">
          {skipLabel}
        </a>
      )}
      <main id={id} className="repos-container">
        <header className="repos-hero">
          <p className="stop-tag">{tag}</p>
          <h1 className="repos-title">{title}</h1>
          <p className="repos-subtitle">{subtitle}</p>
        </header>
        {children}
        <footer className="repos-footer">{footer}</footer>
      </main>
    </>
  );
}
