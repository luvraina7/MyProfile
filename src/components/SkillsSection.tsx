'use client';

import React from 'react';
import { SkillGroup, Locale } from '@/types/career';
import { useInView } from '@/hooks/useInView';
import { Code2, CheckCircle2 } from 'lucide-react';

interface SkillsSectionProps {
  skills: SkillGroup[];
  locale: Locale;
}

export function SkillsSection({ skills, locale }: SkillsSectionProps) {
  const { ref: headerRef, isVisible: headerVisible } = useInView();
  const { ref: gridRef, isVisible: gridVisible } = useInView({ threshold: 0.1 });

  return (
    <section id="skills" className="py-20 md:py-32 relative">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-3xl mx-auto mb-16 scroll-reveal ${headerVisible ? 'is-visible' : ''}`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Code2 className="w-4 h-4" />
            <span>{locale === 'en' ? 'Core Competencies' : '保有スキル・技術スタック'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
            {locale === 'en' ? 'Technical Expertise' : '技術領域と習熟度'}
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-4 leading-relaxed">
            {locale === 'en'
              ? 'Proven in high-traffic production environments across frontend, backend, and infrastructure.'
              : '実務での開発・運用実績に基づいた技術スタック一覧。'}
          </p>
        </div>

        {/* Skill Groups Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {skills.map((group, idx) => (
            <div
              key={idx}
              className={`glass-panel p-7 sm:p-8 flex flex-col justify-between scroll-reveal ${gridVisible ? 'is-visible' : ''} stagger-${idx + 1}`}
            >
              <div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 mb-6 pb-3 border-b border-[var(--border-subtle)]">
                  {group.category}
                </h3>
                <ul className="space-y-5">
                  {group.skills.map((skill, sIdx) => (
                    <li key={sIdx}>
                      <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                        <div className="flex items-center gap-2.5 text-[var(--text-primary)] font-medium">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span>{skill.name}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          {skill.years && (
                            <span className="text-xs font-mono-custom text-[var(--text-muted)]">
                              {skill.years} {locale === 'en' ? 'yrs' : '年'}
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-[var(--border-subtle)] text-xs font-semibold text-cyan-300">
                            {skill.level}
                          </span>
                        </div>
                      </div>
                      {/* Visual Progress Bar */}
                      <div className="skill-bar-track">
                        <div
                          className={`skill-bar-fill ${gridVisible ? 'is-visible' : ''}`}
                          data-level={skill.level}
                          style={{ transitionDelay: `${0.3 + sIdx * 0.1}s` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
