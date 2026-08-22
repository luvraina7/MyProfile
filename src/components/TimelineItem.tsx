'use client';

import React, { useState } from 'react';
import { CareerMilestone, Locale } from '@/types/career';
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

  const categoryGradients: Record<string, string> = {
    'AI & Automation': 'from-emerald-400 to-cyan-500 border-emerald-500/40 text-emerald-400',
    'Performance & DevOps': 'from-amber-400 to-orange-500 border-amber-500/40 text-amber-400',
    Frontend: 'from-cyan-400 to-blue-500 border-cyan-500/40 text-cyan-400',
    'Full-Stack': 'from-indigo-400 to-purple-500 border-indigo-500/40 text-indigo-400',
    Mobile: 'from-rose-400 to-pink-500 border-rose-500/40 text-rose-400',
  };

  const badgeStyle = categoryGradients[item.category] || 'from-cyan-400 to-indigo-500 text-cyan-400 border-cyan-500/40';

  return (
    <article className="relative pl-12 md:pl-0 mb-20 last:mb-0 group">
      {/* Node Marker on Spine */}
      <div className="absolute left-[13px] md:left-1/2 -translate-x-1/2 top-8 z-10">
        <div className="w-6 h-6 rounded-full bg-[var(--bg-primary)] border-2 border-cyan-400 shadow-lg shadow-cyan-400/50 flex items-center justify-center group-hover:scale-125 transition-transform">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
        </div>
      </div>

      {/* Grid container */}
      <div className={`md:grid md:grid-cols-2 md:gap-16 items-start ${index % 2 === 0 ? '' : 'md:grid-flow-dense'}`}>
        {/* Date / Category pill for opposite column on desktop */}
        <div className={`hidden md:flex flex-col justify-center pt-6 ${index % 2 === 0 ? 'text-right pr-8' : 'md:col-start-2 pl-8'}`}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)] w-fit self-start md:self-auto shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {item.period.start} ~ {item.period.end}
            </span>
          </div>
          <span className="text-xs font-bold text-[var(--text-muted)] mt-2 tracking-wider uppercase">
            {item.category}
          </span>
        </div>

        {/* The Main Card with Generous Inner Padding */}
        <div className={`glass-panel p-7 sm:p-9 relative ${index % 2 === 0 ? '' : 'md:col-start-1'}`}>
          {/* Card Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <div className="md:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)] mb-3">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {item.period.start} ~ {item.period.end}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] group-hover:text-cyan-300 transition-colors leading-tight">
                {item.role}
              </h3>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mt-1.5 font-medium">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>{item.company}</span>
              </div>
            </div>

            <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border bg-white/5 ${badgeStyle}`}>
              {item.category}
            </span>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)] mb-6 border-b border-[var(--border-subtle)] pb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{item.location}</span>
            </div>
            {item.teamSize && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{item.teamSize}</span>
              </div>
            )}
          </div>

          {/* Summary Paragraph */}
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-6 font-normal">
            {item.summary}
          </p>

          {/* Impact Metrics */}
          {item.metrics && item.metrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
              {item.metrics.map((m, mIdx) => (
                <div key={mIdx} className="flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-cyan-200">{m.label}: {m.value}</div>
                    {m.description && <div className="text-xs text-[var(--text-secondary)] mt-0.5 opacity-90">{m.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Key Deliverables */}
          {item.highlights.length > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--text-accent)] hover:underline mb-3"
              >
                <span>{locale === 'en' ? 'Key Deliverables & Responsibilities' : '主な担当業務・成果'}</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isExpanded && (
                <ul className="space-y-3.5 mt-3">
                  {item.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
            {item.techStack.map((tech) => {
              const isSelected = selectedTech?.toLowerCase() === tech.toLowerCase();
              return (
                <button
                  key={tech}
                  onClick={() => onSelectTech(tech)}
                  className={`badge ${isSelected ? 'badge-active' : ''}`}
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
