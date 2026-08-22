'use client';

import React from 'react';
import { ProfileData, Locale } from '@/types/career';
import { MapPin, Sparkles, ArrowDown, Terminal, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

interface HeroProps {
  data: ProfileData;
  locale: Locale;
  onOpenApiDocs: () => void;
}

export function Hero({ data, locale, onOpenApiDocs }: HeroProps) {
  return (
    <section id="hero" className="relative pt-16 pb-24 md:pt-28 md:pb-36 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-8 animate-pulse shadow-sm shadow-cyan-500/10">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>{locale === 'en' ? 'Open to New Opportunities in Tokyo / Remote' : '東京 / リモートでの新たな挑戦を歓迎'}</span>
        </div>

        {/* Heading & Subtitles */}
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.2]">
            {data.name}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 leading-snug">
            {data.title}
          </p>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {data.tagline}
          </p>
        </div>

        {/* Quick Meta (Location / Experience / Socials) */}
        <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">{data.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">{data.yearsOfExperience}</span>
          </div>
          <div className="flex items-center gap-3 sm:ml-auto">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-all hover:scale-105 border border-[var(--border-subtle)]"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-all hover:scale-105 border border-[var(--border-subtle)]"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:contact@example.com"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-all hover:scale-105 border border-[var(--border-subtle)]"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Metrics Grid with Generous Padding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {data.metricsOverview.map((metric, idx) => (
            <div key={idx} className="glass-panel p-6 flex flex-col justify-between min-h-[140px]">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-indigo-300">
                  {metric.value}
                </span>
                <div className="text-sm font-bold text-[var(--text-primary)] mt-2">
                  {metric.label}
                </div>
              </div>
              {metric.description && (
                <div className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed opacity-90">
                  {metric.description}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-12">
          <a
            href="#timeline"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2.5 transition-all hover:scale-105"
          >
            <span>{locale === 'en' ? 'Explore Career Journey' : '経歴タイムラインを見る'}</span>
            <ArrowDown className="w-4 h-4" />
          </a>
          <button
            onClick={onOpenApiDocs}
            className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-primary)] font-mono text-sm border border-[var(--border-subtle)] flex items-center gap-2.5 transition-all hover:border-cyan-500/40"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>{locale === 'en' ? 'Test as API (cURL / JSON)' : 'APIとしてテスト (cURL / JSON)'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
