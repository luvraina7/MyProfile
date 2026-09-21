'use client';

import React, { useState } from 'react';
import { CareerMilestone, Locale } from '@/types/career';
import { useInView } from '@/hooks/useInView';
import { Building2, Calendar, MapPin, Users, ChevronDown, ChevronUp, CheckCircle2, TrendingUp } from 'lucide-react';

interface TimelineItemProps {
  item: CareerMilestone;
  index: number;
  locale: Locale;
  selectedTech: string | null;
  onSelectTech: (tech: string) => void;
  prevMilestoneId?: string;
  nextMilestoneId?: string;
  isFirst?: boolean;
  isLast?: boolean;
  isActive?: boolean;
}

export function TimelineItem({
  item,
  index,
  locale,
  selectedTech,
  onSelectTech,
  prevMilestoneId,
  nextMilestoneId,
  isActive = false,
}: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { ref, isVisible } = useInView({ threshold: 0.1 });
  const { ref: nodeRef, isVisible: nodeVisible } = useInView({ threshold: 0.5 });

  const categoryGradients: Record<string, string> = {
    'AI & Automation': 'border-emerald-600/30 bg-emerald-50 text-emerald-950 dark:text-indigo-300 dark:bg-emerald-500/10 dark:border-emerald-500/40',
    'Performance & DevOps': 'border-amber-600/30 bg-amber-50 text-amber-950 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/40',
    Frontend: 'border-cyan-600/30 bg-cyan-50 text-cyan-950 dark:text-indigo-300 dark:bg-cyan-500/10 dark:border-cyan-500/40',
    'Full-Stack': 'border-indigo-600/30 bg-indigo-50 text-indigo-950 dark:text-indigo-300 dark:bg-indigo-500/10 dark:border-indigo-500/40',
    Mobile: 'border-rose-600/30 bg-rose-50 text-rose-950 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-500/40',
  };

  const badgeStyle = categoryGradients[item.category] || 'border-cyan-600/30 bg-cyan-50 text-cyan-950 dark:text-indigo-300 dark:border-cyan-500/40';

  const prevTargetId = prevMilestoneId ? `milestone-${prevMilestoneId}` : 'timeline';
  const nextTargetId = nextMilestoneId ? `milestone-${nextMilestoneId}` : 'agentic';

  const prevTitle = prevMilestoneId
    ? (locale === 'en' ? 'Previous milestone' : '前の経歴へ')
    : (locale === 'en' ? 'Scroll up to Timeline Overview' : '経歴トップへ');

  const nextTitle = nextMilestoneId
    ? (locale === 'en' ? 'Next milestone' : '次の経歴へ')
    : (locale === 'en' ? 'Next section: AI & Agentic' : '次のセクション: AI開発');

  return (
    <article
      id={`milestone-${item.id}`}
      ref={ref}
      className={`relative mb-16 sm:mb-20 lg:mb-24 last:mb-0 group timeline-item-enter scroll-mt-28`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Symmetrical horizontal connector arm on mobile/tablet */}
      <div
        className="lg:hidden absolute left-3.5 sm:left-5 top-[38px] w-4 sm:w-6 h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-400/80 to-transparent pointer-events-none -translate-y-1/2 z-0"
        aria-hidden="true"
      />

      {/* Symmetrical horizontal connector arm on desktop */}
      <div
        className={`hidden lg:block absolute top-[50px] h-[2px] pointer-events-none -translate-y-1/2 z-0 ${
          index % 2 === 0
            ? 'left-1/2 w-10 bg-gradient-to-r from-cyan-400 to-indigo-500/40'
            : 'right-1/2 w-10 bg-gradient-to-l from-cyan-400 to-indigo-500/40'
        }`}
        aria-hidden="true"
      />

      {/* Interactive Milestone Stepper Cluster: Center Node (Mobile/Tablet) + Up/Down Arrows on Desktop */}
      <div
        className="absolute left-3.5 sm:left-5 top-[38px] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 lg:left-1/2 lg:top-[50px]"
        role="navigation"
        aria-label={`Milestone navigation for ${item.role}`}
      >
        {/* Up Arrow — desktop only (hidden lg:flex) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const targetEl = document.getElementById(prevTargetId);
            targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="hidden lg:flex w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white dark:bg-[#0e1426] border border-slate-300 dark:border-white/20 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-[#12233c] active:bg-cyan-100 dark:active:bg-[#162b48] items-center justify-center transition-all hover:scale-115 active:scale-90 shadow-sm cursor-pointer"
          title={prevTitle}
          aria-label={prevTitle}
        >
          <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        </button>

        {/* Center Milestone Node Indicator — dynamically glows when active */}
        <div
          ref={nodeRef}
          className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full bg-[var(--bg-primary)] border-2 transition-all duration-300 ${
            isActive
              ? 'border-cyan-400 shadow-lg shadow-cyan-400/60 scale-110'
              : 'border-indigo-400/40 opacity-70 hover:opacity-100 hover:border-cyan-400/50'
          } flex items-center justify-center timeline-node-pop ${nodeVisible ? 'is-visible' : ''}`}
          title={`${item.period.start}: ${item.role}`}
        >
          {isActive ? (
            <div className="timeline-node-current" />
          ) : (
            <div className="timeline-node-static" />
          )}
        </div>

        {/* Down Arrow — desktop only (hidden lg:flex) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const targetEl = document.getElementById(nextTargetId);
            targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="hidden lg:flex w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white dark:bg-[#0e1426] border border-slate-300 dark:border-white/20 hover:border-cyan-500 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-200 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-[#12233c] active:bg-cyan-100 dark:active:bg-[#162b48] items-center justify-center transition-all hover:scale-115 active:scale-90 shadow-sm cursor-pointer"
          title={nextTitle}
          aria-label={nextTitle}
        >
          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Grid container — slimmed offset on mobile/tablet to give cards maximum width; 2-col on desktop */}
      <div className={`pl-7 sm:pl-10 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-20 items-start ${index % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
        {/* Date / Category pill for opposite column on desktop */}
        <div className={`hidden lg:flex flex-col justify-center pt-8 ${index % 2 === 0 ? 'text-right pr-10 items-end' : 'lg:col-start-2 pl-10 items-start'}`}>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-[var(--border-subtle)] text-xs font-mono-custom text-slate-800 dark:text-[var(--text-secondary)] font-medium w-fit shadow-sm">
            <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>
              {item.period.start} ~ {item.period.end}
            </span>
          </div>
          <span className="text-xs font-bold text-[var(--text-muted)] mt-3 tracking-widest uppercase">
            {item.category}
          </span>
        </div>

        {/* The Main Card */}
        <div className={`glass-panel timeline-card p-6 sm:p-8 lg:p-10 relative ${index % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1'} ${isVisible ? 'scroll-reveal is-visible' : 'scroll-reveal'}`} style={{ animationDelay: `${0.15 + index * 0.1}s` }}>
          {/* Card Header — stacks vertically on phone, row from sm+ */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5 mb-6">
            <div className="space-y-1 min-w-0 w-full sm:w-auto sm:flex-1">
              <div className="lg:hidden inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-[var(--border-subtle)] text-xs font-mono-custom text-slate-800 dark:text-[var(--text-secondary)] font-medium mb-4">
                <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="whitespace-nowrap">
                  {item.period.start} ~ {item.period.end}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] group-hover:text-cyan-300 transition-colors leading-snug tracking-tight [overflow-wrap:anywhere] break-words">
                {item.role}
              </h3>
              <div className="flex items-center gap-2.5 text-[15px] text-[var(--text-secondary)] mt-2 font-medium">
                <Building2 className="w-[18px] h-[18px] text-indigo-400 shrink-0" />
                <span>{item.company}</span>
              </div>
            </div>

            <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold border leading-none shrink-0 ${badgeStyle}`}>
              {item.category}
            </span>
          </div>

          {/* Meta Info — larger gap & icons */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-[var(--text-muted)] mb-7 border-b border-[var(--border-subtle)] pb-5">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-[18px] h-[18px] text-rose-400 shrink-0" />
              <span className="leading-none">{item.location}</span>
            </div>
            {item.teamSize && (
              <div className="flex items-center gap-2.5">
                <Users className="w-[18px] h-[18px] text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span className="leading-none">{item.teamSize}</span>
              </div>
            )}
          </div>

          {/* Summary Paragraph — looser leading */}
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-[1.75] sm:leading-[1.8] mb-7 lg:mb-8 font-normal">
            {item.summary}
          </p>

          {/* Impact Metrics — stacked on phone, 2-col from sm+ */}
          {item.metrics && item.metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-7 lg:mb-8 p-4 sm:p-5 rounded-xl bg-[#f4f2ea] border border-[#e2ded2] dark:bg-cyan-950/20 dark:border-cyan-500/20 shadow-sm metric-box">
              {item.metrics.map((m, mIdx) => (
                <div key={mIdx} className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-indigo-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-[#0f172a] dark:text-indigo-300 leading-tight metric-title">{m.label}: {m.value}</div>
                    {m.description && <div className="text-xs text-slate-700 dark:text-[var(--text-secondary)] leading-relaxed metric-desc">{m.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Key Deliverables — increased spacing */}
          {item.highlights.length > 0 && (
            <div className="mb-8">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls={`deliverables-${index}`}
                className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-accent)] hover:underline mb-4"
              >
                <span>{locale === 'en' ? 'Key Deliverables & Responsibilities' : '主な担当業務・成果'}</span>
                {isExpanded ? <ChevronUp className="w-5 h-5" aria-hidden="true" /> : <ChevronDown className="w-5 h-5" aria-hidden="true" />}
              </button>

              {isExpanded && (
                <ul id={`deliverables-${index}`} className="space-y-4 mt-4">
                  {item.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-3 text-sm text-[var(--text-secondary)] leading-relaxed sm:gap-3.5 sm:text-[15px]">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Tech Stack Tags — more breathing */}
          <div className="flex flex-wrap items-center gap-2 pt-5 sm:pt-6 border-t border-[var(--border-subtle)]">
            {item.techStack.map((tech) => {
              const isSelected = selectedTech?.toLowerCase() === tech.toLowerCase();
              return (
                <button
                  key={tech}
                  onClick={() => onSelectTech(tech)}
                  className={`badge px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-[13px] ${isSelected ? 'badge-active' : ''}`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
