import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeInit } from '@/components/ThemeInit';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Luv Raina | Full Stack Engineer (Tokyo, Japan)',
  description:
    'Career timeline and portfolio of Luv Raina — 6+ years in Japan specializing in Next.js, TypeScript, React Native, Ruby on Rails, AWS, Core Web Vitals, and Agentic AI workflows.',
  keywords: [
    'Luv Raina',
    'Frontend Engineer',
    'Full Stack Engineer',
    'Next.js',
    'TypeScript',
    'Tokyo Software Engineer',
    '職務経歴書',
    'React Native',
    'AWS',
    'Agentic AI',
  ],
  authors: [{ name: 'Luv Raina' }],
  openGraph: {
    title: 'Luv Raina | Full Stack & Frontend Engineer Portfolio',
    description:
      'Explore 6+ years of career progression, enterprise web apps, performance optimization, and AI workflows in Tokyo, Japan.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ja_JP',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeInit />
        <div
          className="fixed inset-0 pointer-events-none -z-10 grid-pattern"
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
        />
        {children}
      </body>
    </html>
  );
}
