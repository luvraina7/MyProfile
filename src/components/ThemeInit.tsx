'use client';

import { useServerInsertedHTML } from 'next/navigation';

const THEME_INIT = `(() => {
  try {
    const stored = localStorage.getItem('theme');
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const theme = stored === 'light' || stored === 'dark' ? stored : preferred;
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  }
})();`;

export function ThemeInit() {
  useServerInsertedHTML(() => (
    <script
      key="theme-init"
      id="theme-init"
      dangerouslySetInnerHTML={{ __html: THEME_INIT }}
    />
  ));
  return null;
}
