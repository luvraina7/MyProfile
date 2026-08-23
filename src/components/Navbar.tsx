'use client';

import React, { useEffect, useState } from 'react';
import { Locale } from '@/types/career';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { Globe, Terminal, Moon, Sun, Briefcase, Cpu, Code2, FolderOpen, Menu } from 'lucide-react';
import { MobileNav } from './MobileNav';

interface NavbarProps {
  locale: Locale;
  onToggleLocale: (newLocale: Locale) => void;
  onOpenApiDocs: () => void;
}

const SECTION_IDS = ['hero', 'timeline', 'agentic', 'projects', 'skills'];

export function Navbar({ locale, onToggleLocale, onOpenApiDocs }: NavbarProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const activeSection = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navLabels = {
    en: {
      timeline: 'Timeline',
      skills: 'Skills',
      aiWorkflow: 'AI & Agentic',
      projects: 'Projects',
      apiPlayground: 'Resume API',
    },
    ja: {
      timeline: '経歴タイムライン',
      skills: 'スキル',
      aiWorkflow: 'AI・エージェント開発',
      projects: 'プロジェクト',
      apiPlayground: '職歴 API',
    },
  }[locale];

  const navItems = [
    { id: 'timeline', icon: Briefcase, label: navLabels.timeline },
    { id: 'agentic', icon: Cpu, label: navLabels.aiWorkflow, iconColor: 'text-emerald-400' },
    { id: 'projects', icon: FolderOpen, label: navLabels.projects },
    { id: 'skills', icon: Code2, label: navLabels.skills },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-[20px] bg-[rgba(14,20,38,0.65)] border-b border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,0.06)_inset] supports-[backdrop-filter]:bg-[rgba(14,20,38,0.55)] transition-all">
        {/* Subtle bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" aria-hidden="true" />
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

          {/* Navigation Links — Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-link hover:text-[var(--text-accent)] transition-colors flex items-center gap-2 ${isActive ? 'nav-link-active' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${item.iconColor || ''}`} />
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* API Playground Button */}
            <button
              onClick={onOpenApiDocs}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-mono-custom font-medium rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 transition-all hover:scale-105"
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
              <span className="hidden sm:inline">{locale === 'en' ? '日本語' : 'English'}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        locale={locale}
        activeSection={activeSection}
        onOpenApiDocs={onOpenApiDocs}
      />
    </>
  );
}
