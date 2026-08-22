'use client';

import React, { useEffect, useState } from 'react';
import { Locale } from '@/types/career';
import { Globe, Terminal, Moon, Sun, Briefcase, Cpu, Code2 } from 'lucide-react';

interface NavbarProps {
  locale: Locale;
  onToggleLocale: (newLocale: Locale) => void;
  onOpenApiDocs: () => void;
}

export function Navbar({ locale, onToggleLocale, onOpenApiDocs }: NavbarProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navLabels = {
    en: {
      timeline: 'Timeline',
      skills: 'Skills',
      aiWorkflow: 'AI & Agentic',
      apiPlayground: 'Resume API',
    },
    ja: {
      timeline: '経歴タイムライン',
      skills: 'スキル',
      aiWorkflow: 'AI・エージェント開発',
      apiPlayground: '職歴 API',
    },
  }[locale];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-opacity-70 border-b border-[var(--border-subtle)] transition-all">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            LR
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-[var(--text-primary)]">
              Luv Raina
            </span>
            <span className="text-xs text-[var(--text-muted)] leading-none">
              Full Stack • Tokyo
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
          <a href="#timeline" className="hover:text-[var(--text-accent)] transition-colors flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            {navLabels.timeline}
          </a>
          <a href="#skills" className="hover:text-[var(--text-accent)] transition-colors flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            {navLabels.skills}
          </a>
          <a href="#agentic" className="hover:text-[var(--text-accent)] transition-colors flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            {navLabels.aiWorkflow}
          </a>
        </nav>

        {/* Controls: API Drawer, Language Switcher, Theme Switcher */}
        <div className="flex items-center gap-3">
          {/* API Playground Button */}
          <button
            onClick={onOpenApiDocs}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 transition-all hover:scale-105"
            title="Open Resume as an API Playground"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">cURL / API</span>
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={() => onToggleLocale(locale === 'en' ? 'ja' : 'en')}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all"
            aria-label="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{locale === 'en' ? '日本語' : 'English'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
