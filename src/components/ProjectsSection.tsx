'use client';

import React from 'react';
import { Locale } from '@/types/career';
import { useInView } from '@/hooks/useInView';
import { FolderOpen, ExternalLink, Terminal, Cpu } from 'lucide-react';
import { GithubIcon } from './Icons';

interface ProjectsSectionProps {
  locale: Locale;
}

interface ProjectCard {
  title: string;
  description: string;
  techStack: string[];
  impact: string;
  icon: React.ElementType;
  iconColor: string;
  liveUrl?: string;
  githubUrl?: string;
}

export function ProjectsSection({ locale }: ProjectsSectionProps) {
  const { ref: headerRef, isVisible: headerVisible } = useInView();
  const { ref: gridRef, isVisible: gridVisible } = useInView();

  const content = {
    en: {
      badge: 'Featured Work',
      title: 'Projects & Artifacts',
      subtitle: 'Tangible proof of work — from this portfolio itself to production-grade engineering.',
      projects: [
        {
          title: 'WordPress → Next.js Enterprise Migration',
          description: 'Led AI-accelerated migration of legacy corporate platforms using custom MCP integration, reducing human verification from 7 days to 1 day.',
          techStack: ['Next.js', 'Docker', 'MCP', 'WordPress'],
          impact: '85% Time Saved',
          icon: Cpu,
          iconColor: 'text-emerald-400',
        },
        {
          title: 'Cross-Platform Consultation App',
          description: 'React Native mobile app achieving 80% feature parity with web portal, resulting in 30% increase in app-originated consultations.',
          techStack: ['React Native', 'Redux Toolkit', 'OpenAPI', 'Ruby on Rails'],
          impact: '+30% Inquiries',
          icon: Terminal,
          iconColor: 'text-indigo-400',
        },
        {
          title: 'Core Web Vitals Optimization Suite',
          description: 'Year-long continuous optimization project for enterprise corporate sites — LCP/CLS improvements, Datadog observability dashboards, and automated image optimization pipelines.',
          techStack: ['PageSpeed', 'Datadog', 'WebP Pipeline', 'Custom Skills'],
          impact: 'Grade A CWV',
          icon: FolderOpen,
          iconColor: 'text-amber-400',
        },
      ] as ProjectCard[],
    },
    ja: {
      badge: '注目プロジェクト',
      title: 'プロジェクト・成果物',
      subtitle: '開発成果の実例 — 本ポートフォリオから本番環境のエンジニアリングまで。',
      projects: [
        {
          title: 'WordPress → Next.js エンタープライズ移行',
          description: 'カスタムMCP統合を活用し、レガシー企業プラットフォームのAI加速移行をリード。人手による検証を7日から1日に短縮。',
          techStack: ['Next.js', 'Docker', 'MCP', 'WordPress'],
          impact: '85%の時間削減',
          icon: Cpu,
          iconColor: 'text-emerald-400',
        },
        {
          title: 'クロスプラットフォーム相談アプリ',
          description: 'Webポータルと80%の機能パリティを実現したReact Nativeモバイルアプリ。アプリ経由の相談問い合わせが30%増加。',
          techStack: ['React Native', 'Redux Toolkit', 'OpenAPI', 'Ruby on Rails'],
          impact: '問い合わせ+30%',
          icon: Terminal,
          iconColor: 'text-indigo-400',
        },
        {
          title: 'Core Web Vitals最適化スイート',
          description: 'エンタープライズ企業サイトの年間継続最適化プロジェクト — LCP/CLS改善、Datadog監視ダッシュボード、画像最適化パイプラインの自動化。',
          techStack: ['PageSpeed', 'Datadog', 'WebPパイプライン', 'カスタムSkill'],
          impact: 'CWVグレードA',
          icon: FolderOpen,
          iconColor: 'text-amber-400',
        },
      ] as ProjectCard[],
    },
  }[locale];

  return (
    <section id="projects" className="py-24 md:py-36 relative">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-3xl mx-auto mb-16 scroll-reveal ${headerVisible ? 'is-visible' : ''}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <FolderOpen className="w-4 h-4" />
            <span>{content.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
            {content.title}
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-4 leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Projects Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10"
        >
          {content.projects.map((project, idx) => {
            const Icon = project.icon;
            return (
              <div
                key={idx}
                className={`glass-panel project-card p-6 sm:p-8 lg:p-10 flex flex-col justify-between group min-h-[220px] sm:min-h-[260px] lg:min-h-[280px] scroll-reveal ${gridVisible ? 'is-visible' : ''} stagger-${idx + 1}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl bg-white/5 border border-[var(--border-subtle)] ${project.iconColor} group-hover:scale-110 transition-transform shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-semibold">
                      {project.impact}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-cyan-300 transition-colors leading-snug break-keep">
                    {project.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack + Links */}
                <div className="mt-8 pt-4 border-t border-[var(--border-subtle)]">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="badge text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{locale === 'en' ? 'View Live' : 'ライブを見る'}</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-white transition-colors font-medium"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
