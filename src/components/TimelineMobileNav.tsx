'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CareerMilestone, Locale } from '@/types/career';
import { ChevronUp, ChevronDown, Check, Layers } from 'lucide-react';

interface TimelineMobileNavProps {
  timeline: CareerMilestone[];
  locale: Locale;
  currentIndex?: number;
  onSelectIndex?: (index: number) => void;
}

export function TimelineMobileNav({
  timeline,
  locale,
  currentIndex: controlledIndex,
  onSelectIndex,
}: TimelineMobileNavProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [internalIndex, setInternalIndex] = useState(0);
  const currentIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;
  const setCurrentIndex = onSelectIndex || setInternalIndex;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. Observe the #timeline container to toggle visibility of floating nav
  useEffect(() => {
    const timelineEl = document.getElementById('timeline');
    if (!timelineEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setIsMenuOpen(false);
          document.body.removeAttribute('data-timeline-nav-active');
        } else {
          document.body.setAttribute('data-timeline-nav-active', 'true');
        }
      },
      {
        root: null,
        threshold: 0.02,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(timelineEl);
    return () => {
      observer.disconnect();
      document.body.removeAttribute('data-timeline-nav-active');
    };
  }, []);

  // 2. Track which milestone is currently in the active reading zone
  useEffect(() => {
    if (!timeline.length) return;

    const milestoneObservers: IntersectionObserver[] = [];

    timeline.forEach((item, index) => {
      const el = document.getElementById(`milestone-${item.id}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setCurrentIndex(index);
          }
        },
        {
          root: null,
          rootMargin: '-15% 0px -55% 0px',
          threshold: 0.1,
        }
      );

      observer.observe(el);
      milestoneObservers.push(observer);
    });

    return () => {
      milestoneObservers.forEach((obs) => obs.disconnect());
    };
  }, [timeline]);

  // 3. Dismiss milestone menu on outside click or touch
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isMenuOpen]);

  if (!timeline.length) return null;

  const currentMilestone = timeline[currentIndex] || timeline[0];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === timeline.length - 1;

  const scrollToMilestone = (index: number) => {
    setIsMenuOpen(false);
    const targetItem = timeline[index];
    if (!targetItem) return;

    const el = document.getElementById(`milestone-${targetItem.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFirst) {
      const timelineEl = document.getElementById('timeline');
      timelineEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      scrollToMilestone(currentIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLast) {
      const agenticEl = document.getElementById('agentic');
      agenticEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      scrollToMilestone(currentIndex + 1);
    }
  };

  return (
    <aside
      aria-label="Timeline Milestone Navigator"
      className={`lg:hidden fixed z-40 left-1/2 -translate-x-1/2 transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
      style={{
        bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div ref={menuRef} className="relative flex flex-col items-center">
        {/* Milestone Quick Jump Sheet (Opens above pill dock) */}
        {isMenuOpen && (
          <div
            id="timeline-milestone-mobile-menu"
            role="menu"
            aria-label="Select milestone"
            className="absolute bottom-full mb-3 w-[90vw] max-w-sm rounded-2xl bg-slate-900/95 dark:bg-[#0c1427]/98 backdrop-blur-xl border border-cyan-500/30 p-2 shadow-2xl shadow-cyan-950/50 max-h-72 overflow-y-auto divide-y divide-slate-800/80 dark:divide-white/10"
            style={{
              animation: 'reveal-up 0.22s cubic-bezier(0.16, 1, 0.3, 1) both',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div className="px-3 py-2 flex items-center justify-between text-[11px] font-mono-custom text-cyan-400 font-bold uppercase tracking-wider">
              <span>{locale === 'en' ? 'Select Career Milestone' : '経歴を選択'}</span>
              <span>{currentIndex + 1} / {timeline.length}</span>
            </div>

            {timeline.map((m, idx) => {
              const year = m.period.start.split('-')[0] || m.period.start;
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="menuitem"
                  onClick={() => scrollToMilestone(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 active:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-xs font-medium text-slate-100 dark:text-white truncate">
                      {m.company}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {year} • {m.role}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Floating Thumb Dock Pill */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/90 dark:bg-[#0c1427]/90 backdrop-blur-lg border border-cyan-500/35 shadow-xl shadow-cyan-950/40 text-slate-100 select-none">
          {/* Previous / Up Milestone Button (44px hit area for iOS & Android standards) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label={
              isFirst
                ? locale === 'en' ? 'Top of timeline' : '経歴トップへ'
                : locale === 'en' ? 'Previous milestone' : '前の経歴へ'
            }
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-cyan-500/20 active:bg-cyan-500/30 text-slate-200 hover:text-cyan-300 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Center Indicator Button: Tapping toggles quick jump sheet */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            aria-controls="timeline-milestone-mobile-menu"
            aria-label={locale === 'en' ? 'Current milestone details. Tap to browse.' : '現在の経歴。タップで一覧表示。'}
            className="flex items-center gap-2 px-3.5 h-11 rounded-full bg-white/5 hover:bg-cyan-500/15 active:bg-cyan-500/25 border border-white/10 hover:border-cyan-500/30 active:scale-95 transition-all cursor-pointer max-w-[190px] sm:max-w-[240px]"
          >
            {/* Step Counter Badge */}
            <span className="text-xs font-mono-custom font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
              {currentIndex + 1}/{timeline.length}
            </span>

            {/* Company & Year Label */}
            <span className="text-xs font-medium text-slate-100 truncate">
              {currentMilestone.company}
            </span>

            <Layers className={`w-3.5 h-3.5 text-cyan-400 shrink-0 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Next / Down Milestone Button (44px hit area for iOS & Android standards) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label={
              isLast
                ? locale === 'en' ? 'Next section' : '次のセクションへ'
                : locale === 'en' ? 'Next milestone' : '次の経歴へ'
            }
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-cyan-500/20 active:bg-cyan-500/30 text-slate-200 hover:text-cyan-300 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
