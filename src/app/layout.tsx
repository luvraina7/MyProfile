import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Luv Raina | Full Stack & Frontend Software Engineer (Tokyo, Japan)',
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
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
