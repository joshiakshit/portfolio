import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import './globals.css';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://joshiakshit.me'),
  title: { default: 'ash — code, projects & notes', template: '%s — ash' },
  description: 'A computer science hobbyist’s corner of the internet. Side projects, small tools, and notes on what I’m learning.',
  authors: [{ name: 'ash' }],
  openGraph: {
    title: 'ash',
    description: 'A computer science hobbyist’s corner of the internet. Side projects, small tools, and notes on what I’m learning.',
    url: 'https://joshiakshit.me',
    type: 'website',
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body>{children}</body>
    </html>
  );
}
