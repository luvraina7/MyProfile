'use client';

import React from 'react';
import { Locale } from '@/types/career';
import { Filter, X } from 'lucide-react';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  allTechStacks: string[];
  selectedTech: string | null;
  onSelectTech: (tech: string | null) => void;
  locale: Locale;
}

export function FilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  allTechStacks,
  selectedTech,
  onSelectTech,
  locale,
}: FilterBarProps) {
  const categoryTranslations: Record<string, { en: string; ja: string }> = {
    All: { en: 'All Roles', ja: 'すべて' },
    'AI & Automation': { en: 'AI & Automation', ja: 'AI・自動化' },
    'Performance & DevOps': { en: 'Performance & Observability', ja: '高速化・監視' },
    Frontend: { en: 'Frontend & UI', ja: 'フロントエンド' },
    'Full-Stack': { en: 'Full-Stack & Cloud', ja: 'フルスタック・クラウド' },
    Mobile: { en: 'Mobile & API', ja: 'モバイル・API' },
  };

  const topTech = ['Next.js', 'TypeScript', 'Docker', 'MCP', 'React Native', 'AWS', 'Ruby on Rails', 'Datadog'];

  return (
    <div className="space-y-4 mb-8">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
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
