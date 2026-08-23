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
}

export function TimelineItem({ item, index, locale, selectedTech, onSelectTech }: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { ref, isVisible } = useInView({ threshold: 0.1 });
  const { ref: nodeRef, isVisible: nodeVisible } = useInView({ threshold: 0.5 });

  const isCurrent = item.period.end === 'Present' || item.period.end === '現在';

  const categoryGradients: Record<string, string> = {
    'AI & Automation': 'from-emerald-400 to-cyan-500 border-emerald-500/40 text-emerald-400',
    'Performance & DevOps': 'from-amber-400 to-orange-500 border-amber-500/40 text-amber-400',
    Frontend: 'from-cyan-400 to-blue-500 border-cyan-500/40 text-cyan-400',
    'Full-Stack': 'from-indigo-400 to-purple-500 border-indigo-500/40 text-indigo-400',
    Mobile: 'from-rose-400 to-pink-500 border-rose-500/40 text-rose-400',
  };

  const badgeStyle = categoryGradients[item.category] || 'from-cyan-400 to-indigo-500 text-cyan-400 border-cyan-500/40';

  return (
    <article
      ref={ref}
      className={`relative mb-16 sm:mb-20 lg:mb-24 last:mb-0 group timeline-item-enter`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Node Marker — <lg: centered in the gap below its card (equidistant from both cards);
          lg: pinned to the vertical center of its card (empty center channel, no overlap) */}
      <div
        ref={nodeRef}
        className="timeline-node-anchor absolute left-1/2 top-[calc(100%+1.125rem)] -translate-x-1/2 pointer-events-none sm:top-[calc(100%+1.625rem)] lg:top-1/2 lg:-translate-y-1/2"
      >
        <div className={`w-7 h-7 rounded-full bg-[var(--bg-primary)] border-2 ${isCurrent ? 'border-cyan-400 shadow-lg shadow-cyan-400/50' : 'border-indigo-400/60'} flex items-center justify-center group-hover:scale-125 transition-transform timeline-node-pop ${nodeVisible ? 'is-visible' : ''}`}>
          {isCurrent ? (
            <div className="timeline-node-current" />
          ) : (
            <div className="timeline-node-static" />
          )}
        </div>
      </div>

      {/* Gap mask below this card — hides spine in the gap when this card is hovered */}
      <div className="timeline-gap-mask-bottom absolute left-1/2 right-1/2 -translate-x-1/2 top-[calc(100%+2rem)] h-[2rem] pointer-events-none sm:h-[2.5rem] lg:hidden" />
      {/* Gap mask above this card — hides spine in the gap above when the PREVIOUS card is hovered */}
      <div className="timeline-gap-mask-top absolute left-1/2 right-1/2 -translate-x-1/2 bottom-[calc(100%+2rem)] h-[2rem] pointer-events-none sm:h-[2.5rem] lg:hidden" />

      {/* Grid container — single column below lg so tablets get the readable stacked layout */}
      <div className={`lg:grid lg:grid-cols-2 lg:gap-20 items-start ${index % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
        {/* Date / Category pill for opposite column on desktop */}
        <div className={`hidden lg:flex flex-col justify-center pt-8 ${index % 2 === 0 ? 'text-right pr-10 items-end' : 'lg:col-start-2 pl-10 items-start'}`}>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-[var(--border-subtle)] text-xs font-mono-custom text-[var(--text-secondary)] w-fit shadow-sm">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>
              {item.period.start} ~ {item.period.end}
            </span>
          </div>
          <span className="text-xs font-bold text-[var(--text-muted)] mt-3 tracking-widest uppercase">
            {item.category}
          </span>
        </div>

        {/* The Main Card — phone p-6, tablet p-8, desktop p-10; opaque on stacked layouts so the spine stays hidden behind it */}
        <div className={`glass-panel timeline-card p-6 sm:p-8 lg:p-10 relative ${index % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1'} ${isVisible ? 'scroll-reveal is-visible' : 'scroll-reveal'}`} style={{ animationDelay: `${0.15 + index * 0.1}s` }}>
          {/* Card Header — stacks vertically on phone, row from sm+ */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5 mb-6">
            <div className="space-y-1 min-w-0 w-full sm:w-auto sm:flex-1">
              <div className="lg:hidden inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[var(--border-subtle)] text-xs font-mono-custom text-[var(--text-secondary)] mb-4">
                <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="whitespace-nowrap">
                  {item.period.start} ~ {item.period.end}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] group-hover:text-cyan-300 transition-colors leading-snug tracking-tight">
                {item.role}
              </h3>
              <div className="flex items-center gap-2.5 text-[15px] text-[var(--text-secondary)] mt-2 font-medium">
                <Building2 className="w-[18px] h-[18px] text-indigo-400 shrink-0" />
                <span>{item.company}</span>
              </div>
            </div>

            <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold border bg-white/5 leading-none shrink-0 ${badgeStyle}`}>
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
                <Users className="w-[18px] h-[18px] text-cyan-400 shrink-0" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-7 lg:mb-8 p-4 sm:p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
              {item.metrics.map((m, mIdx) => (
                <div key={mIdx} className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-cyan-200 leading-tight">{m.label}: {m.value}</div>
                    {m.description && <div className="text-xs text-[var(--text-secondary)] leading-relaxed opacity-90">{m.description}</div>}
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
                className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-accent)] hover:underline mb-4"
              >
                <span>{locale === 'en' ? 'Key Deliverables & Responsibilities' : '主な担当業務・成果'}</span>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {isExpanded && (
                <ul className="space-y-4 mt-4">
                  {item.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-3 text-sm text-[var(--text-secondary)] leading-relaxed sm:gap-3.5 sm:text-[15px]">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
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
