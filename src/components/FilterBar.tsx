'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Locale } from '@/types/career';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  allTechStacks?: string[];
  selectedTech: string | null;
  onSelectTech: (tech: string | null) => void;
  locale: Locale;
}

export function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedTech,
  onSelectTech,
  locale,
}: FilterBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [dropdownOpen]);

  const categoryTranslations: Record<string, { en: string; ja: string }> = {
    All: { en: 'All Roles', ja: 'すべて' },
    'AI & Automation': { en: 'AI & Automation', ja: 'AI・自動化' },
    'Performance & DevOps': { en: 'Performance & Observability', ja: '高速化・監視' },
    Frontend: { en: 'Frontend & UI', ja: 'フロントエンド' },
    'Full-Stack': { en: 'Full-Stack & Cloud', ja: 'フルスタック・クラウド' },
    Mobile: { en: 'Mobile & API', ja: 'モバイル・API' },
  };

  const topTech = ['Next.js', 'TypeScript', 'Docker', 'MCP', 'React Native', 'AWS', 'Ruby on Rails', 'Datadog'];

  const currentLabel = categoryTranslations[selectedCategory]
    ? categoryTranslations[selectedCategory][locale]
    : selectedCategory;

  return (
    <div className="space-y-4 mb-8">
      {/* Category Filter: Mobile Dropdown (< sm) & Desktop Horizontal Pills (>= sm) */}
      {/* Mobile Custom Dropdown Menu right under button */}
      <div className="sm:hidden" ref={dropdownRef}>
        <div className="relative">
          <button
            type="button"
            id="timeline-category-filter-button"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 dark:bg-slate-900/80 text-[var(--text-primary)] border border-cyan-500/30 hover:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 shadow-sm cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Filter className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span className="truncate">{currentLabel}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 shrink-0 ml-2 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu - displayed right under the filter button */}
          {dropdownOpen && (
            <div
              role="listbox"
              className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[var(--bg-secondary)] dark:bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 shadow-2xl shadow-black/50 overflow-hidden py-1.5 max-h-64 overflow-y-auto"
              style={{ animation: 'reveal-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) both' }}
            >
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                const label = categoryTranslations[cat] ? categoryTranslations[cat][locale] : cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelectCategory(cat);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left font-medium transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                    }`}
                  >
                    <span>{label}</span>
                    {isSelected && <span className="text-cyan-400 font-bold ml-2">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Category Pills */}
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>{locale === 'en' ? 'Filter:' : '絞り込み:'}</span>
        </div>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const label = categoryTranslations[cat] ? categoryTranslations[cat][locale] : cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-subtle)]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Quick Tech Tag Filters */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[var(--text-muted)] font-mono">
          {locale === 'en' ? 'Tech Tag:' : '技術タグ:'}
        </span>
        {topTech.map((tech) => {
          const isActive = selectedTech?.toLowerCase() === tech.toLowerCase();
          return (
            <button
              key={tech}
              onClick={() => onSelectTech(isActive ? null : tech)}
              className={`badge ${isActive ? 'badge-active' : ''}`}
            >
              {tech}
            </button>
          );
        })}
        {selectedTech && (
          <button
            onClick={() => onSelectTech(null)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 rounded-full border border-rose-500/20"
          >
            <X className="w-3 h-3" />
            <span>{locale === 'en' ? 'Clear' : 'クリア'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
