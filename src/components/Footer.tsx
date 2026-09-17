'use client';

import React from 'react';
import { Locale } from '@/types/career';
import { useInView } from '@/hooks/useInView';
import { Mail, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const { ref, isVisible } = useInView({ threshold: 0.1 });

  const colophonItems = [
    { label: 'Next.js 16', icon: '⚡' },
    { label: 'TypeScript', icon: '🔷' },
    { label: 'Tailwind CSS', icon: '🎨' },
    { label: 'OpenAPI 3.1', icon: '📡' },
  ];

  const agenticItems = [
    { label: locale === 'en' ? 'Custom Agentic Skills & Rules' : 'カスタムAI Skills & Rules', icon: '🤖' },
    { label: locale === 'en' ? 'MCP Integration' : 'MCP連携', icon: '🔗' },
    { label: locale === 'en' ? 'AI-Assisted Development' : 'AI支援開発', icon: '✨' },
  ];

  return (
    <footer ref={ref} className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/70 backdrop-blur-md pt-16 pb-24">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* "How This Site Was Built" Colophon */}
        <div className={`glass-panel p-6 sm:p-8 mb-12 scroll-reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {locale === 'en' ? 'How This Site Was Built' : 'このサイトの技術構成'}
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed max-w-2xl">
            {locale === 'en'
              ? 'This portfolio itself is a proof of competence — built with modern tooling and AI-assisted agentic workflows from end to end.'
              : '本ポートフォリオそのものが技術力の証明です。最新のツールとAIエージェント駆動ワークフローで全工程を構築。'}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {colophonItems.map((item) => (
              <span key={item.label} className="colophon-tag">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {agenticItems.map((item) => (
              <span key={item.label} className="colophon-tag">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Main Footer Row */}
        <div className={`flex flex-col md:flex-row items-center justify-between gap-8 scroll-reveal ${isVisible ? 'is-visible' : ''} stagger-2`}>
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <span className="font-bold text-base text-[var(--text-primary)]">
              Luv Raina • Tokyo, Japan
            </span>
            <span className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md leading-relaxed">
              {locale === 'en'
                ? 'Engineered with Next.js App Router, TypeScript, and AI Agentic Skills & Rules.'
                : 'Next.js App Router、TypeScript、AI駆動開発（Skills/Rules）で設計・構築。'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/luvraina7"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-colors border border-[var(--border-subtle)]"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/luv-raina-011a5a103/"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-colors border border-[var(--border-subtle)]"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:contact@example.com"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-colors border border-[var(--border-subtle)]"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
