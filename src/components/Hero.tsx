'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { ProfileData, Locale } from '@/types/career';
import { ArrowDown, Mail, Download, ChevronDown, FileText } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

interface HeroProps {
  data: ProfileData;
  locale: Locale;
}

const RESUME_FILES = {
  en: { path: '/resumes/Luv_Raina_Updated_Resume.docx', label: 'English Resume' },
  ja: { path: '/resumes/職務経歴書.docx', label: '日本語履歴書' },
} as const;

function CountUpMetric({ value, isVisible }: { value: string; isVisible: boolean }) {
  // Try to extract a number from the value
  const numMatch = value.match(/(\d+)/);
  const num = numMatch ? parseInt(numMatch[1], 10) : null;
  const prefix = num !== null ? value.slice(0, value.indexOf(numMatch![0])) : '';
  const suffix = num !== null ? value.slice(value.indexOf(numMatch![0]) + numMatch![0].length) : '';

  const { display, start } = useCountUp({
    end: num || 0,
    duration: 1200,
    startOnView: true,
    prefix,
    suffix,
  });

  useEffect(() => {
    if (isVisible && num !== null) start();
  }, [isVisible, num, start]);

  if (num === null) return <>{value}</>;
  return <>{display}</>;
}

export function Hero({ data, locale }: HeroProps) {
  const ambientRef = useRef<HTMLDivElement>(null);
  const [resumeMenuOpen, setResumeMenuOpen] = useState(false);
  const resumeMenuRef = useRef<HTMLDivElement>(null);
  const { ref: heroRef, isVisible: heroVisible } = useInView({ threshold: 0.1 });
  const { ref: metricsRef, isVisible: metricsVisible } = useInView({ threshold: 0.2 });

  // Close resume menu on outside click
  useEffect(() => {
    if (!resumeMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (resumeMenuRef.current && !resumeMenuRef.current.contains(e.target as Node)) {
        setResumeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [resumeMenuOpen]);

  // Parallax effect on ambient background
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ambientRef.current) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    ambientRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section id="hero" className="relative pt-10 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Parallax ambient glow layer */}
      <div ref={ambientRef} className="ambient-bg" />
      {/* Hero depth gradient mesh */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_800px_400px_at_50%_-20%,rgba(56,189,248,0.09),transparent_60%),radial-gradient(ellipse_600px_300px_at_85%_15%,rgba(129,140,248,0.08),transparent_62%)] pointer-events-none" aria-hidden="true" />

      <div
        ref={heroRef}
        className="w-full max-w-5xl mx-auto px-6 sm:px-8 relative z-10"
      >

        {/* Heading & Subtitles — more dramatic */}
        <div className={`space-y-6 max-w-3xl scroll-reveal ${heroVisible ? 'is-visible' : ''} stagger-2`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.2] drop-shadow-[0_2px_20px_rgba(56,189,248,0.12)]">
            {data.name}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 leading-snug drop-shadow-sm">
            {data.title}
          </p>
          {/* Status Pill — below title */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full status-pill">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
            <span className="text-sm">{locale === 'en' ? 'Based in Tokyo, Japan' : '拠点：日本・東京'}</span>
          </div>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {data.tagline}
          </p>
        </div>

        {/* Action Buttons (moved near heading for faster access) */}
        <div className={`flex flex-wrap items-start gap-4 mt-6 scroll-reveal ${heroVisible ? 'is-visible' : ''} stagger-3`}>
          <a
            href="#timeline"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2.5 transition-all hover:scale-105"
          >
            <span>{locale === 'en' ? 'Explore Career Journey' : '経歴タイムラインを見る'}</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          {/* Resume Download Dropdown — EN / JA selector */}
          <div ref={resumeMenuRef} className="flex flex-col">
            <button
              onClick={() => setResumeMenuOpen((v) => !v)}
              aria-expanded={resumeMenuOpen}
              aria-haspopup="menu"
              aria-controls="resume-download-menu"
              className={`px-5 py-3.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-subtle-hover)] text-[var(--text-primary)] font-semibold text-sm border flex items-center gap-2.5 transition-all hover:border-emerald-500/40 ${resumeMenuOpen ? 'border-emerald-500/50 bg-[var(--surface-subtle-hover)]' : 'border-[var(--border-subtle)]'}`}
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{locale === 'en' ? 'Download Resume' : '履歴書をダウンロード'}</span>
              <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${resumeMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* In-flow dropdown avoids covering cards/content below */}
            {resumeMenuOpen && (
              <div
                id="resume-download-menu"
                role="menu"
                className="mt-2 w-56 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-xl shadow-black/40 overflow-hidden"
                style={{ animation: 'reveal-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) both' }}
              >
                {(Object.keys(RESUME_FILES) as Array<keyof typeof RESUME_FILES>).map((key) => (
                  <a
                    key={key}
                    role="menuitem"
                    href={RESUME_FILES[key].path}
                    download
                    onClick={() => setResumeMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-cyan-500/10 transition-colors group border-b border-[var(--border-subtle)] last:border-b-0"
                  >
                    <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--text-accent)] transition-colors">
                      {RESUME_FILES[key].label}
                    </span>
                    <span className="ml-auto text-[10px] font-mono-custom text-[var(--text-muted)] uppercase tracking-wider">
                      {key === 'en' ? '.docx EN' : '.docx JA'}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Social Links */}
        <div className={`flex items-center gap-3 mt-6 text-sm text-[var(--text-secondary)] scroll-reveal ${heroVisible ? 'is-visible' : ''} stagger-4`}>
          <a
            href="https://github.com/luvraina7"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-all hover:scale-105 border border-[var(--border-subtle)]"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
            <a
              href="https://www.linkedin.com/in/luv-raina-011a5a103/"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-all hover:scale-105 border border-[var(--border-subtle)]"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:luvraina7@gmail.com"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-all hover:scale-105 border border-[var(--border-subtle)]"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

        {/* Metrics Grid with Count-Up Animation */}
        <div
          ref={metricsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8"
        >
          {data.metricsOverview.map((metric, idx) => (
            <div
              key={idx}
              className={`glass-panel p-6 flex flex-col justify-between min-h-[140px] scroll-reveal ${metricsVisible ? 'is-visible' : ''} stagger-${idx + 1}`}
            >
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-700 via-indigo-600 to-emerald-700 dark:from-cyan-300 dark:to-indigo-300">
                  <CountUpMetric value={metric.value} isVisible={metricsVisible} />
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
      </div>
    </section>
  );
}
