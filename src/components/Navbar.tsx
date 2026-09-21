'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Locale } from '@/types/career';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { Languages, Moon, Sun, Briefcase, Cpu, Code2, FolderOpen, Menu, X } from 'lucide-react';
import { MobileNav } from './MobileNav';

interface NavbarProps {
  locale: Locale;
  onToggleLocale: (newLocale: Locale) => void;
}

const SECTION_IDS = ['hero', 'timeline', 'agentic', 'projects', 'skills', 'footer'];

export function Navbar({ locale, onToggleLocale }: NavbarProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeSection = useScrollSpy(SECTION_IDS);
  const hasSyncedTheme = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync theme with html[data-theme]
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
    if (currentTheme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time post-hydration sync with the ThemeInit inline script
      setTheme(currentTheme);
      document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (!hasSyncedTheme.current) {
      hasSyncedTheme.current = true;
      return;
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
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
      timeline: '経歴',
      skills: 'スキル',
      aiWorkflow: 'AI・開発',
      projects: '実績',
      apiPlayground: '職歴 API',
    },
  }[locale];

  const chapterMap: Record<string, { en: string; ja: string }> = {
    hero: { en: 'Overview', ja: '概要' },
    timeline: { en: 'Timeline', ja: '経歴' },
    agentic: { en: 'AI & Agentic', ja: 'AI開発' },
    projects: { en: 'Projects', ja: '実績' },
    skills: { en: 'Skills', ja: 'スキル' },
    footer: { en: 'Connect', ja: '連絡先' },
  };
  const currentChapter = chapterMap[activeSection] || chapterMap.hero;

  const navItems = [
    { id: 'timeline', icon: Briefcase, label: navLabels.timeline },
    { id: 'agentic', icon: Cpu, label: navLabels.aiWorkflow, iconColor: 'text-emerald-400' },
    { id: 'projects', icon: FolderOpen, label: navLabels.projects },
    { id: 'skills', icon: Code2, label: navLabels.skills },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-[20px] bg-[var(--bg-header)] border-b border-[var(--border-subtle)] shadow-[0_8px_32px_rgba(0,0,0,0.22),0_1px_0_rgba(255,255,255,0.06)_inset] supports-[backdrop-filter]:bg-[var(--bg-header-fallback)] transition-all">
        {/* Scroll Progress Bar at very bottom of header */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.7)] transition-[width] duration-150 ease-out z-10"
          style={{ width: `${scrollProgress}%` }}
          aria-hidden="true"
        />

        {/* Subtle bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-2">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <a href="#hero" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0 text-sm sm:text-base">
                LR
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm sm:text-base tracking-tight text-[var(--text-primary)]">
                  Luv Raina
                </span>
                <span className="text-[11px] sm:text-xs text-[var(--text-muted)] leading-none hidden xs:inline">
                  Full Stack • Tokyo
                </span>
              </div>
            </a>

            {/* Mobile / Tablet Current Section Badge */}
            <div className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[11px] font-mono-custom text-cyan-700 dark:text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-medium truncate max-w-[95px] sm:max-w-[130px]">
                {locale === 'en' ? currentChapter.en : currentChapter.ja}
              </span>
            </div>
          </div>

          {/* Navigation Links — Desktop only (tablets use the hamburger) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bilingual Language Switcher with universal Languages icon */}
            <div className="relative group">
              <button
                onClick={() => onToggleLocale(locale === 'en' ? 'ja' : 'en')}
                className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm active:scale-95"
                aria-label={locale === 'en' ? 'Switch to Japanese (日本語)' : '英語 (English) に切り替え'}
              >
                <Languages className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="hidden sm:inline-block font-bold tracking-tight whitespace-nowrap">
                  {locale === 'en' ? '日本語' : 'English'}
                </span>
              </button>

              {/* Hover / Tap feedback tooltip popup */}
              <div
                role="tooltip"
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/95 dark:bg-slate-800/95 text-slate-100 text-[11px] font-medium tracking-wide shadow-xl border border-slate-700/60 whitespace-nowrap pointer-events-none z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>{locale === 'en' ? 'Switch to Japanese (日本語)' : '英語 (English) に切り替え'}</span>
              </div>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile / Tablet Hamburger & Close Toggle */}
            <button
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className={`lg:hidden p-2 rounded-xl border transition-all cursor-pointer ${
                isMobileOpen
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-300 shadow-sm shadow-cyan-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] border-[var(--border-subtle)]'
              }`}
              aria-label={
                isMobileOpen
                  ? (locale === 'en' ? 'Close navigation menu' : 'ナビゲーションメニューを閉じる')
                  : (locale === 'en' ? 'Open navigation menu' : 'ナビゲーションメニューを開く')
              }
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>
      <div className="h-20" aria-hidden="true" />

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        locale={locale}
        onToggleLocale={onToggleLocale}
        activeSection={activeSection}
      />
    </>
  );
}
