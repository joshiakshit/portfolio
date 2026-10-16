import type { Metadata } from 'next';
import DoodleCanvas from './doodle-canvas';
import './globals.css';
import TopNav from './top-nav';

export const metadata: Metadata = {
  metadataBase: new URL('https://joshiakshit.me'),
  title: { default: 'ash', template: '%s — ash' },
  description: 'Akshit Joshi (ash): Backend Engineer + Cybersecurity hobbyist.',
  authors: [{ name: 'ash' }],
  openGraph: {
    title: 'ash',
    description: 'Akshit Joshi (ash): Backend Engineer + Cybersecurity hobbyist.',
    url: 'https://joshiakshit.me',
    type: 'website',
  },
  icons: { icon: '/favicon.svg' },
};

const themeInitScript = `
try {
  const s = localStorage.getItem('theme');
  const d = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', s || (d ? 'dark' : 'light'));
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <DoodleCanvas />
        <TopNav />
        {children}
      </body>
    </html>
  );
}
