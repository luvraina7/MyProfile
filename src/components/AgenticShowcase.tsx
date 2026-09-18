'use client';

import React, { useState } from 'react';
import { Locale } from '@/types/career';
import { useInView } from '@/hooks/useInView';
import {
  Cpu,
  Terminal,
  ShieldCheck,
  Zap,
  Sparkles,
  FileCode2,
  ArrowUpRight,
  Download,
} from 'lucide-react';
import { SkillModal } from './SkillModal';
import { RuleModal } from './RuleModal';
import { WebpModal } from './WebpModal';

interface AgenticShowcaseProps {
  locale: Locale;
}

export function AgenticShowcase({ locale }: AgenticShowcaseProps) {
  const { ref: headerRef, isVisible: headerVisible } = useInView();
  const { ref: gridRef, isVisible: gridVisible } = useInView();
  const [isSkillModalOpen, setIsSkillModalOpen] = useState<boolean>(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState<boolean>(false);
  const [isWebpModalOpen, setIsWebpModalOpen] = useState<boolean>(false);

  const content = {
    en: {
      badge: 'Agentic Engineering & AI Workflows',
      title: 'Real-World AI-Driven Development in Production',
      subtitle:
        'Moving beyond basic prompt chat: architecting custom Agentic Skills, Rules, and Model Context Protocol (MCP) to automate mission-critical engineering workflows.',
      items: [
        {
          id: 'webpack-noise',
          title: 'Webpack Build Noise Elimination Skill',
          impact: 'Minutes → Seconds',
          desc: 'Automates pre-commit hygiene and builds cleanup scripts, drastically minimizing PR review overhead.',
          icon: Zap,
          color: 'text-amber-400',
          hasSkillModal: true,
          actionLabel: 'Inspect Skill (.md)',
          actionSubtext: 'View Spec & Download',
        },
        {
          id: 'responsive-audit',
          title: 'Responsive Layout Audit Rule',
          impact: 'Early Anomaly Detection',
          desc: 'Rule-based layout regression auditor preventing CSS side-effects across multi-page enterprise platforms.',
          icon: ShieldCheck,
          color: 'text-emerald-400',
          hasRuleModal: true,
          actionLabel: 'Inspect Rule (.md)',
          actionSubtext: 'View Spec & Download',
        },
        {
          id: 'image-optimization',
          title: 'Automated Image Optimization Skill',
          impact: 'Core Web Vitals Boost',
          desc: 'Autonomous WebP conversion and asset tree-shaking pipeline ensuring zero bloated assets reach production.',
          icon: Sparkles,
          color: 'text-cyan-400',
          hasWebpModal: true,
          actionLabel: 'Inspect Skill (.md)',
          actionSubtext: 'View Spec & Download',
        },
        {
          id: 'ai-migration',
          title: 'WordPress to Next.js AI Migration',
          impact: '7 Days → 1 Day Verification',
          desc: 'Leveraged MCP (Model Context Protocol) and custom agent rules to accelerate legacy enterprise migration.',
          icon: Cpu,
          color: 'text-indigo-400',
        },
      ],
    },
    ja: {
      badge: 'AI・エージェント駆動開発の実践',
      title: '実務におけるAI駆動エンジニアリングと自作Skill/Rule',
      subtitle:
        '単なるチャット利用にとどまらず、MCP（Model Context Protocol）や自作Skill・Ruleを設計し、開発・レビュー・移行プロセスの生産性を飛躍的に向上。',
      items: [
        {
          id: 'webpack-noise',
          title: 'webpackビルドノイズ除去Skill',
          impact: '数分 → 数秒へ短縮',
          desc: 'コミット前のクリーンアップ作業を自動化し、PRレビュー時の不要な差分と工数を大幅削減。',
          icon: Zap,
          color: 'text-amber-400',
          hasSkillModal: true,
          actionLabel: 'スキル定義書 (.md) を確認',
          actionSubtext: '仕様・コード閲覧 & DL',
        },
        {
          id: 'responsive-audit',
          title: 'レスポンシブレイアウト監査Rule',
          impact: '表示崩れの早期検知',
          desc: '複数ページにまたがるCSS副作用や表示崩れの早期検出を仕組み化し、修正品質のばらつきを抑制。',
          icon: ShieldCheck,
          color: 'text-emerald-400',
          hasRuleModal: true,
          actionLabel: '監査ルール (.md) を確認',
          actionSubtext: '仕様・コード閲覧 & DL',
        },
        {
          id: 'image-optimization',
          title: '画像最適化Skill（WebP自動変換）',
          impact: 'Core Web Vitals向上',
          desc: '画像のWebP変換と不要ファイルの削除を自動化し、サイトの表示速度改善と保守工数を削減。',
          icon: Sparkles,
          color: 'text-cyan-400',
          hasWebpModal: true,
          actionLabel: 'スキル定義書 (.md) を確認',
          actionSubtext: '仕様・コード閲覧 & DL',
        },
        {
          id: 'ai-migration',
          title: 'WordPressからNext.jsへのAI移行',
          impact: '確認作業 7日 → 1日短縮',
          desc: 'MCPと自作Rulesを活用し、レガシー企業サイトのモダンNext.jsへの移行を迅速化。',
          icon: Cpu,
          color: 'text-indigo-400',
        },
      ],
    },
  }[locale];

  return (
    <section id="agentic" className="py-24 md:py-36 relative">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center max-w-3xl mx-auto mb-16 scroll-reveal ${headerVisible ? 'is-visible' : ''}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Cpu className="w-4 h-4" />
            <span>{content.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight break-keep">
            {content.title}
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-4 leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Grid of Agentic Accomplishments */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10"
        >
          {content.items.map((item, idx) => {
            const Icon = item.icon;
            const isClickable = Boolean(item.hasSkillModal || item.hasRuleModal || item.hasWebpModal);

            return (
              <div
                key={idx}
                onClick={() => {
                  if (item.hasSkillModal) {
                    setIsSkillModalOpen(true);
                  } else if (item.hasRuleModal) {
                    setIsRuleModalOpen(true);
                  } else if (item.hasWebpModal) {
                    setIsWebpModalOpen(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    (item.hasSkillModal || item.hasRuleModal || item.hasWebpModal) &&
                    (e.key === 'Enter' || e.key === ' ')
                  ) {
                    e.preventDefault();
                    if (item.hasSkillModal) setIsSkillModalOpen(true);
                    if (item.hasRuleModal) setIsRuleModalOpen(true);
                    if (item.hasWebpModal) setIsWebpModalOpen(true);
                  }
                }}
                tabIndex={isClickable ? 0 : undefined}
                role={isClickable ? 'button' : undefined}
                aria-label={
                  isClickable
                    ? `${item.title} - ${item.actionLabel}`
                    : undefined
                }
                className={`glass-panel p-6 sm:p-8 lg:p-10 flex flex-col justify-between group min-h-[200px] sm:min-h-[240px] lg:min-h-[260px] scroll-reveal ${
                  gridVisible ? 'is-visible' : ''
                } stagger-${idx + 1} transition-all duration-300 ${
                  isClickable
                    ? 'cursor-pointer hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 relative'
                    : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`p-3.5 rounded-2xl bg-white/5 border border-[var(--border-subtle)] ${item.color} group-hover:scale-110 transition-transform shadow-inner`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      {item.hasSkillModal && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-medium animate-pulse">
                          <FileCode2 className="w-3 h-3" />
                          <span>.md Skill</span>
                        </span>
                      )}
                      {item.hasRuleModal && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium animate-pulse">
                          <FileCode2 className="w-3 h-3" />
                          <span>.md Rule</span>
                        </span>
                      )}
                      {item.hasWebpModal && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-medium animate-pulse">
                          <FileCode2 className="w-3 h-3" />
                          <span>.md Skill</span>
                        </span>
                      )}
                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono-custom font-semibold">
                        {item.impact}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-cyan-300 transition-colors leading-snug break-keep flex items-center justify-between">
                    <span>{item.title}</span>
                    {isClickable && (
                      <ArrowUpRight className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                    )}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-custom">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Production Tested & Maintained</span>
                  </div>

                  {item.hasSkillModal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSkillModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all group-hover:scale-105 shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.actionLabel}</span>
                    </button>
                  )}

                  {item.hasRuleModal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRuleModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all group-hover:scale-105 shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.actionLabel}</span>
                    </button>
                  )}

                  {item.hasWebpModal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsWebpModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all group-hover:scale-105 shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.actionLabel}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Modal for Webpack Build Noise Elimination Skill */}
      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        locale={locale}
      />

      {/* Rule Modal for Responsive Layout Audit Rule */}
      <RuleModal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        locale={locale}
      />

      {/* WebP Modal for Automated Image Optimization Skill */}
      <WebpModal
        isOpen={isWebpModalOpen}
        onClose={() => setIsWebpModalOpen(false)}
        locale={locale}
      />
    </section>
  );
}
