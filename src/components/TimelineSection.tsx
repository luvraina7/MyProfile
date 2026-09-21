'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CareerMilestone, Locale } from '@/types/career';
import { FilterBar } from './FilterBar';
import { TimelineItem } from './TimelineItem';
import { TimelineMobileNav } from './TimelineMobileNav';
import { useInView } from '@/hooks/useInView';
import { Sparkles, Briefcase, ChevronDown } from 'lucide-react';

interface TimelineSectionProps {
  timeline: CareerMilestone[];
  allTechStacks: string[];
  locale: Locale;
}

export function TimelineSection({ timeline, allTechStacks, locale }: TimelineSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [milestoneDropdownOpen, setMilestoneDropdownOpen] = useState(false);
  const milestoneDropdownRef = useRef<HTMLDivElement>(null);
  const { ref: headerRef, isVisible: headerVisible } = useInView({ threshold: 0.15 });
  const { ref: spineRef, isVisible: spineVisible } = useInView({ threshold: 0.05 });

  useEffect(() => {
    if (!milestoneDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (milestoneDropdownRef.current && !milestoneDropdownRef.current.contains(e.target as Node)) {
        setMilestoneDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [milestoneDropdownOpen]);

  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(0);

  const categories = ['All', 'AI & Automation', 'Performance & DevOps', 'Frontend', 'Full-Stack', 'Mobile'];

  const filteredTimeline = useMemo(() => {
    return timeline.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchTech =
        !selectedTech || item.techStack.some((t) => t.toLowerCase() === selectedTech.toLowerCase());
      return matchCat && matchTech;
    });
  }, [timeline, selectedCategory, selectedTech]);

  // Track the milestone currently in the active reading viewport zone
  useEffect(() => {
    if (!filteredTimeline.length) return;

    const observers: IntersectionObserver[] = [];

    filteredTimeline.forEach((item, index) => {
      const el = document.getElementById(`milestone-${item.id}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setActiveMilestoneIndex(index);
          }
        },
        {
          root: null,
          rootMargin: '-15% 0px -50% 0px',
          threshold: 0.05,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [filteredTimeline]);

  return (
    <section id="timeline" className="py-20 md:py-32 relative">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center max-w-3xl mx-auto mb-16 scroll-reveal ${headerVisible ? 'is-visible' : ''}`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Briefcase className="w-4 h-4" />
            <span>{locale === 'en' ? 'Career Progression' : '職務経歴・実績'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight [overflow-wrap:anywhere] break-words">
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

        {/* Milestone Quick Jump — Mobile Dropdown (< sm) & Desktop Scrubber (>= sm) */}
        <div className="my-4">
          {/* Mobile View: Custom Dropdown Menu right under button */}
          <div className="sm:hidden" ref={milestoneDropdownRef}>
            <div className="relative">
              <button
                type="button"
                id="timeline-milestone-jump-button"
                onClick={() => setMilestoneDropdownOpen((v) => !v)}
                aria-expanded={milestoneDropdownOpen}
                aria-haspopup="menu"
                className="w-full flex items-center justify-between pl-8 pr-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 dark:bg-slate-900/80 text-[var(--text-primary)] border border-cyan-500/30 hover:border-cyan-500/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 shadow-sm cursor-pointer transition-all text-left"
              >
                {/* Left Indicator Icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                </div>

                <span className="truncate">
                  {locale === 'en' ? '⚡ Jump to a specific milestone...' : '⚡ 経歴を選択してジャンプ...'}
                </span>

                <ChevronDown
                  className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 shrink-0 ml-2 ${
                    milestoneDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu - displayed directly under the button */}
              {milestoneDropdownOpen && (
                <div
                  role="menu"
                  className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-[var(--bg-secondary)] dark:bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 shadow-2xl shadow-black/50 overflow-hidden py-1.5 max-h-72 overflow-y-auto divide-y divide-[var(--border-subtle)]"
                  style={{ animation: 'reveal-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) both' }}
                >
                  {timeline.map((m) => {
                    const startYear = m.period.start.split('-')[0] || m.period.start;
                    const isPresent = m.period.end === 'Present' || m.period.end === '現在';
                    const eraLabel = isPresent ? `${startYear} (Present)` : startYear;
                    const roleLabel = m.role;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMilestoneDropdownOpen(false);
                          const el = document.getElementById(`milestone-${m.id}`);
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="w-full flex flex-col items-start px-4 py-2.5 text-left text-xs transition-colors hover:bg-cyan-500/10 group cursor-pointer"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="font-mono-custom font-semibold text-cyan-600 dark:text-cyan-400 shrink-0 text-[11px]">
                            {eraLabel}
                          </span>
                          <span className="font-semibold text-[var(--text-primary)] truncate">
                            • {m.company}
                          </span>
                        </div>
                        <span className="text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] truncate w-full mt-0.5">
                          {roleLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Desktop View: Horizontal Scrubber (sm+) */}
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
            <span className="text-xs font-mono-custom text-[var(--text-muted)] font-semibold shrink-0 mr-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
              {locale === 'en' ? 'Quick Jump:' : '経歴ジャンプ:'}
            </span>
            {timeline.map((m) => {
              const startYear = m.period.start.split('-')[0] || m.period.start;
              const isPresent = m.period.end === 'Present' || m.period.end === '現在';
              const eraLabel = isPresent ? `${startYear} (Present)` : startYear;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    const el = document.getElementById(`milestone-${m.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-mono-custom font-semibold bg-white/5 hover:bg-cyan-500/15 text-[var(--text-secondary)] hover:text-cyan-700 dark:hover:text-cyan-300 border border-[var(--border-subtle)] hover:border-cyan-500/40 transition-all shrink-0 active:scale-95 shadow-sm cursor-pointer"
                >
                  {eraLabel} • {m.company}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Container with Spine — spine stays hidden until the container is in view
            so it never paints before the cards on mid-scroll refresh */}
        <div ref={spineRef} className="relative mt-8">
          <div className={`timeline-spine ${spineVisible && filteredTimeline.length > 0 ? 'is-visible' : ''}`}></div>

          {filteredTimeline.length > 0 ? (
            filteredTimeline.map((item, idx) => (
              <TimelineItem
                key={item.id}
                item={item}
                index={idx}
                prevMilestoneId={idx > 0 ? filteredTimeline[idx - 1].id : undefined}
                nextMilestoneId={idx < filteredTimeline.length - 1 ? filteredTimeline[idx + 1].id : undefined}
                isFirst={idx === 0}
                isLast={idx === filteredTimeline.length - 1}
                locale={locale}
                selectedTech={selectedTech}
                onSelectTech={(tech) => setSelectedTech(tech)}
                isActive={activeMilestoneIndex === idx}
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
                className="mt-6 px-5 py-2.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-indigo-900 dark:text-cyan-300 text-sm font-semibold border border-cyan-500/30 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/30 transition-all cursor-pointer"
              >
                {locale === 'en' ? 'Reset Filters' : 'フィルターをリセット'}
              </button>
            </div>
          )}
        </div>

        {/* Mobile & Tablet Floating Milestone Thumb Navigator (iOS & Android optimized) */}
        {filteredTimeline.length > 0 && (
          <TimelineMobileNav
            timeline={filteredTimeline}
            locale={locale}
            currentIndex={activeMilestoneIndex}
            onSelectIndex={setActiveMilestoneIndex}
          />
        )}
      </div>
    </section>
  );
}
