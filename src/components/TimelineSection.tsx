'use client';

import React, { useState, useMemo } from 'react';
import { CareerMilestone, Locale } from '@/types/career';
import { FilterBar } from './FilterBar';
import { TimelineItem } from './TimelineItem';
import { useInView } from '@/hooks/useInView';
import { Sparkles, Briefcase } from 'lucide-react';

interface TimelineSectionProps {
  timeline: CareerMilestone[];
  allTechStacks: string[];
  locale: Locale;
}

export function TimelineSection({ timeline, allTechStacks, locale }: TimelineSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useInView({ threshold: 0.15 });

  const categories = ['All', 'AI & Automation', 'Performance & DevOps', 'Frontend', 'Full-Stack', 'Mobile'];

  const filteredTimeline = useMemo(() => {
    return timeline.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchTech =
        !selectedTech || item.techStack.some((t) => t.toLowerCase() === selectedTech.toLowerCase());
      return matchCat && matchTech;
    });
  }, [timeline, selectedCategory, selectedTech]);

  return (
    <section id="timeline" className="py-20 md:py-32 relative">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center max-w-3xl mx-auto mb-16 scroll-reveal ${headerVisible ? 'is-visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Briefcase className="w-4 h-4" />
            <span>{locale === 'en' ? 'Career Progression' : '職務経歴・実績'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
            {locale === 'en' ? '6+ Years of Impact in Japan' : '日本での6年以上の開発実績と進化'}
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-4 leading-relaxed">
            {locale === 'en'
              ? 'Tracking hands-on projects, architecture migrations, and measurable business outcomes.'
              : 'モバイル、フロントエンド、バックエンド、AI駆動開発への進化の足跡。'}
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          allTechStacks={allTechStacks}
          selectedTech={selectedTech}
          onSelectTech={setSelectedTech}
          locale={locale}
        />

        {/* Timeline Container with Spine */}
        <div className="relative mt-12">
          <div className="timeline-spine"></div>

          {filteredTimeline.length > 0 ? (
            filteredTimeline.map((item, idx) => (
              <TimelineItem
                key={item.id}
                item={item}
                index={idx}
                locale={locale}
                selectedTech={selectedTech}
                onSelectTech={(tech) => setSelectedTech(tech)}
              />
            ))
          ) : (
            <div className="glass-panel p-12 text-center my-12">
              <Sparkles className="w-10 h-10 text-cyan-400 mx-auto mb-3 opacity-60" />
              <p className="text-base text-[var(--text-secondary)]">
                {locale === 'en'
                  ? 'No milestones match this filter. Try selecting another category or clear the tech tag.'
                  : '該当する経歴が見つかりませんでした。別のカテゴリまたはタグをお試しください。'}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedTech(null);
                }}
                className="mt-6 px-5 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-sm font-semibold border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
              >
                {locale === 'en' ? 'Reset Filters' : 'フィルターをリセット'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
