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
      className={`relative pl-14 md:pl-0 mb-24 last:mb-0 group timeline-item-enter`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Node Marker on Spine — Current role pulses, past roles are static */}
      <div
        ref={nodeRef}
        className="absolute left-[13px] md:left-1/2 -translate-x-1/2 top-10 z-10"
      >
        <div className={`w-7 h-7 rounded-full bg-[var(--bg-primary)] border-2 ${isCurrent ? 'border-cyan-400 shadow-lg shadow-cyan-400/50' : 'border-indigo-400/60'} flex items-center justify-center group-hover:scale-125 transition-transform timeline-node-pop ${nodeVisible ? 'is-visible' : ''}`}>
          {isCurrent ? (
            <div className="timeline-node-current" />
          ) : (
            <div className="timeline-node-static" />
          )}
        </div>
      </div>

      {/* Grid container */}
      <div className={`md:grid md:grid-cols-2 md:gap-20 items-start ${index % 2 === 0 ? '' : 'md:grid-flow-dense'}`}>
        {/* Date / Category pill for opposite column on desktop */}
        <div className={`hidden md:flex flex-col justify-center pt-8 ${index % 2 === 0 ? 'text-right pr-10' : 'md:col-start-2 pl-10'}`}>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-[var(--border-subtle)] text-xs font-mono-custom text-[var(--text-secondary)] w-fit self-start md:self-auto shadow-sm">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>
              {item.period.start} ~ {item.period.end}
            </span>
          </div>
          <span className="text-xs font-bold text-[var(--text-muted)] mt-3 tracking-widest uppercase">
            {item.category}
          </span>
        </div>

        {/* The Main Card — increased padding & breathing room */}
        <div className={`glass-panel p-8 sm:p-10 relative ${index % 2 === 0 ? '' : 'md:col-start-1'} ${isVisible ? 'scroll-reveal is-visible' : 'scroll-reveal'}`} style={{ animationDelay: `${0.15 + index * 0.1}s` }}>
          {/* Card Header — more spacing */}
          <div className="flex flex-wrap items-start justify-between gap-5 mb-6">
            <div className="space-y-1">
              <div className="md:hidden inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[var(--border-subtle)] text-xs font-mono-custom text-[var(--text-secondary)] mb-4">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>
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

            <span className={`px-4 py-2 rounded-xl text-xs font-semibold border bg-white/5 leading-none ${badgeStyle}`}>
              {item.category}
            </span>
          </div>

          {/* Meta Info — larger gap & icons */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-[var(--text-muted)] mb-7 border-b border-[var(--border-subtle)] pb-5">
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
          <p className="text-[15px] sm:text-base text-[var(--text-secondary)] leading-[1.8] mb-8 font-normal">
            {item.summary}
          </p>

          {/* Impact Metrics — more padding & gap */}
          {item.metrics && item.metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
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
                    <li key={hIdx} className="flex items-start gap-3.5 text-sm sm:text-[15px] text-[var(--text-secondary)] leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Tech Stack Tags — more breathing */}
          <div className="flex flex-wrap items-center gap-2.5 pt-6 border-t border-[var(--border-subtle)]">
            {item.techStack.map((tech) => {
              const isSelected = selectedTech?.toLowerCase() === tech.toLowerCase();
              return (
                <button
                  key={tech}
                  onClick={() => onSelectTech(tech)}
                  className={`badge px-3.5 py-2 text-[13px] ${isSelected ? 'badge-active' : ''}`}
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
