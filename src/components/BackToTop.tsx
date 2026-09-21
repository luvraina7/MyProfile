'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Locale } from '@/types/career';

interface BackToTopProps {
  locale: Locale;
}

const SHOW_AFTER_SCROLL_Y = 320;

export function BackToTop({ locale }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL_Y);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label={locale === 'en' ? 'Back to top' : 'トップへ戻る'}
      inert={!isVisible}
      className={`back-to-top-btn fixed z-40 h-10 w-10 sm:h-12 sm:w-12 rounded-xl border border-cyan-300/60 bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/35 hover:bg-cyan-400 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] transition-all duration-200 ${
        isVisible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'invisible pointer-events-none translate-y-2 opacity-0'
      }`}
      style={{
        right: 'calc(1rem + env(safe-area-inset-right))',
        bottom: 'calc(1rem + env(safe-area-inset-bottom))',
      }}
    >
      <ArrowUp className="mx-auto h-4 w-4 sm:h-5 sm:w-5" />
    </button>
  );
}
