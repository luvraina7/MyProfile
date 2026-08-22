'use client';

import React from 'react';
import { Locale } from '@/types/career';
import { Terminal, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

interface FooterProps {
  locale: Locale;
  onOpenApiDocs: () => void;
}

export function Footer({ locale, onOpenApiDocs }: FooterProps) {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/70 backdrop-blur-md pt-16 pb-24">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
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
          <button
            onClick={onOpenApiDocs}
            className="flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'OpenAPI 3.1 Spec' : 'OpenAPI 3.1 仕様書'}</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-colors border border-[var(--border-subtle)]"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
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
    </footer>
  );
}
