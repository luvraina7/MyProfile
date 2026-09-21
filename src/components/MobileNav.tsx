'use client';

import React from 'react';
import { Locale } from '@/types/career';
import { Briefcase, Code2, Cpu, FolderOpen, Languages } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  activeSection: string;
  onToggleLocale?: (newLocale: Locale) => void;
}

export function MobileNav({ isOpen, onClose, locale, activeSection, onToggleLocale }: MobileNavProps) {
  const links = [
    { id: 'hero', icon: Briefcase, label: locale === 'en' ? 'Home / Overview' : 'トップ・概要' },
    { id: 'timeline', icon: Briefcase, label: locale === 'en' ? 'Career Timeline' : '経歴タイムライン' },
    { id: 'agentic', icon: Cpu, label: locale === 'en' ? 'AI & Agentic' : 'AI・エージェント開発' },
    { id: 'projects', icon: FolderOpen, label: locale === 'en' ? 'Projects' : 'プロジェクト' },
    { id: 'skills', icon: Code2, label: locale === 'en' ? 'Skills' : 'スキル' },
  ];

  const handleLinkClick = (id: string) => {
    onClose();
    // Small delay to let the nav close animation start
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`mobile-nav-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Panel */}
      <nav
        className={`mobile-nav-panel ${isOpen ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="pt-24 px-6 pb-6 flex flex-col min-h-full">
          {/* Panel Header */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-mono-custom font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {locale === 'en' ? 'Quick Navigation' : 'ページ内ジャンプ'}
            </span>
            <span className="text-[11px] font-mono-custom px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {activeSection}
            </span>
          </div>

          {/* Nav Links */}
          <ul className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : ''}`} />
                    {link.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Language Switcher in Mobile Drawer */}
          {onToggleLocale && (
            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                <Languages className="w-3.5 h-3.5 text-cyan-400" />
                <span>{locale === 'en' ? 'Language / 言語' : '言語切り替え'}</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onToggleLocale('en');
                    onClose();
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    locale === 'en'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25 scale-[1.02]'
                      : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 border border-[var(--border-subtle)]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onToggleLocale('ja');
                    onClose();
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    locale === 'ja'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25 scale-[1.02]'
                      : 'bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 border border-[var(--border-subtle)]'
                  }`}
                >
                  日本語
                </button>
              </div>
            </div>
          )}

        </div>
      </nav>
    </>
  );
}
