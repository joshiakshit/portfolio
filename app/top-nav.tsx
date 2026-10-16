'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function TopNav() {
  const pathname = usePathname();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add('theme-ready');
    const current =
      root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
    window.dispatchEvent(new CustomEvent('ash-theme-change', { detail: next }));
  };

  return (
    <>
      <header className="top-nav" role="banner">
        <div className="nav-left">
          <Link href="/" className="nav-brand" aria-label="ash home">
            ash
          </Link>
        </div>

        <nav className="nav-right" aria-label="Primary navigation">
          <Link
            href="/blog"
            className={`nav-link ${pathname?.startsWith('/blog') ? 'is-current' : ''}`}
          >
            blog
          </Link>
          <a
            href="#resume"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              showToast('resume — CV & PDF coming soon');
            }}
          >
            resume
          </a>
          <Link
            href="/projects"
            className={`nav-link ${pathname?.startsWith('/projects') ? 'is-current' : ''}`}
          >
            repositories
          </Link>

          <button
            type="button"
            id="theme-toggle"
            className="nav-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark or light theme"
            title="Toggle dark/light theme"
          >
            <svg
              className="icon-sun"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4.5"></circle>
              <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"></path>
            </svg>
            <svg
              className="icon-moon"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z"></path>
            </svg>
          </button>

          <button
            type="button"
            id="profile-btn"
            className="nav-profile"
            onClick={() => showToast('profile — operator card inactive for now')}
            aria-label="Profile (inactive for now)"
            title="Profile (inactive for now)"
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M5 20c1.5-3.8 4.2-5.5 7-5.5s5.5 1.7 7 5.5"></path>
            </svg>
            <span className="profile-status-dot" aria-hidden="true"></span>
          </button>
        </nav>
      </header>

      <div
        id="nav-toast"
        className={`nav-toast ${toastMsg ? 'is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toastMsg}
      </div>
    </>
  );
}
