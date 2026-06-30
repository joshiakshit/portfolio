import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import './globals.css';

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://joshiakshit.live'),
  title: { default: 'ash', template: '%s — ash' },
  description: 'software developer. builds stuff.',
  authors: [{ name: 'ash' }],
  openGraph: {
    title: 'ash',
    description: 'software developer. builds stuff.',
    url: 'https://joshiakshit.live',
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
