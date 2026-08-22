'use client';

import React from 'react';
import { Locale } from '@/types/career';
import { Cpu, Terminal, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface AgenticShowcaseProps {
  locale: Locale;
}

export function AgenticShowcase({ locale }: AgenticShowcaseProps) {
  const content = {
    en: {
      badge: 'Agentic Engineering & AI Workflows',
      title: 'Real-World AI-Driven Development in Production',
      subtitle:
        'Moving beyond basic prompt chat: architecting custom Agentic Skills, Rules, and Model Context Protocol (MCP) to automate mission-critical engineering workflows.',
      items: [
        {
          title: 'Webpack Build Noise Elimination Skill',
          impact: 'Minutes → Seconds',
          desc: 'Automates pre-commit hygiene and builds cleanup scripts, drastically minimizing PR review overhead.',
          icon: Zap,
          color: 'text-amber-400',
        },
        {
          title: 'Responsive Layout Audit Rule',
          impact: 'Early Anomaly Detection',
          desc: 'Rule-based layout regression auditor preventing CSS side-effects across multi-page enterprise platforms.',
          icon: ShieldCheck,
          color: 'text-emerald-400',
        },
        {
          title: 'Automated Image Optimization Skill',
          impact: 'Core Web Vitals Boost',
          desc: 'Autonomous WebP conversion and asset tree-shaking pipeline ensuring zero bloated assets reach production.',
          icon: Sparkles,
          color: 'text-cyan-400',
        },
        {
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
          title: 'webpackビルドノイズ除去Skill',
          impact: '数分 → 数秒へ短縮',
          desc: 'コミット前のクリーンアップ作業を自動化し、PRレビュー時の不要な差分と工数を大幅削減。',
          icon: Zap,
          color: 'text-amber-400',
        },
        {
          title: 'レスポンシブレイアウト監査Rule',
          impact: '表示崩れの早期検知',
          desc: '複数ページにまたがるCSS副作用や表示崩れの早期検出を仕組み化し、修正品質のばらつきを抑制。',
          icon: ShieldCheck,
          color: 'text-emerald-400',
        },
        {
          title: '画像最適化Skill（WebP自動変換）',
          impact: 'Core Web Vitals向上',
          desc: '画像のWebP変換と不要ファイルの削除を自動化し、サイトの表示速度改善と保守工数を削減。',
          icon: Sparkles,
          color: 'text-cyan-400',
        },
        {
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
        <div className="text-center max-w-3xl mx-auto mb-16">
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

        {/* Grid of Agentic Accomplishments with Spacious Padding & 32px Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {content.items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel p-8 sm:p-10 flex flex-col justify-between group min-h-[260px]">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl bg-white/5 border border-[var(--border-subtle)] ${item.color} group-hover:scale-110 transition-transform shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold">
                      {item.impact}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-cyan-300 transition-colors leading-snug break-keep">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Production Tested & Maintained</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
