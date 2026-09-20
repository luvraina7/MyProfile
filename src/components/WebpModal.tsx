'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Locale } from '@/types/career';
import {
  X,
  Download,
  Copy,
  Check,
  Sparkles,
  Terminal,
  CheckCircle2,
  FileText,
  Code2,
  ListOrdered,
  Layers,
} from 'lucide-react';

interface WebpModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

const CLI_SNIPPETS: Record<
  string,
  { title: string; category: string; description: string; code: string }
> = {
  inventory: {
    title: '1. Image Inventory (inventory-images.mjs)',
    category: 'Asset Discovery',
    description:
      'Scans scoped PHP, SCSS, and JS files for local image references under kaisetu-pack/img/ to detect missing assets.',
    code: `cd kaisetu-pack

# Scan by route (e.g. kaisetu-reason)
node scripts/inventory-images.mjs --route kaisetu-reason --json

# Scan specific files
node scripts/inventory-images.mjs --files wp_core/wp-content/themes/ibjap/page-kaisetu-reason.php`,
  },
  convert: {
    title: '2. Automated WebP Conversion (convert-to-webp.mjs)',
    category: 'Format Transformation',
    description:
      'Converts PNG, JPG, and SVG assets into WebP with lossless/lossy optimization without deleting originals.',
    code: `cd kaisetu-pack

# Generate sibling .webp files for all route assets
node scripts/convert-to-webp.mjs --route kaisetu-reason

# Output summary report (converted count, size reduction % saved)`,
  },
  sass_lint: {
    title: '3. SASS Compile & Stylelint Fix',
    category: 'CSS Sync & Linting',
    description:
      'Recompiles compressed SCSS with updated .webp URLs and runs mandatory stylelint fixes to satisfy CI.',
    code: `# Recompile SCSS to compressed CSS with no source maps
npx sass src/page/ibjsystem.scss assets/ibjsystem.css --style=compressed --no-source-map

# Mandatory auto-fix to satisfy stylelint rules
npx stylelint --fix assets/ibjsystem.css assets/kaisetu_page.css

# Run repository CI linter verification
npm run stylelintKaisetu`,
  },
  safe_delete: {
    title: '4. Safe Original Pruning Policy',
    category: 'Zero-Orphan Policy',
    description:
      'Safety assertions before deleting original PNG/JPG/SVG files (requires repo-wide grep hits === 0).',
    code: `# Check if original PNG has zero remaining references in wp_core or src/
git grep "floating.png" wp_core/ kaisetu-pack/src/ kaisetu-pack/assets/

# Only delete original when sibling .webp exists AND grep returns 0 hits
git rm kaisetu-pack/img/reason/floating.png

# Final status check
git status --short`,
  },
  noise_clean: {
    title: '5. Webpack Build Noise Clean Integration',
    category: 'Pre-Commit Hygiene',
    description:
      'Integrates with clean-kaisetu-asset-rebuilds to ensure unedited assets recompiled by watch mode are reverted.',
    code: `# Run webpack noise cleanup skill before committing
node ~/.cursor/skills/clean-kaisetu-asset-rebuilds/scripts/find-webpack-noise.js

# Revert unintended asset noise
~/.cursor/skills/clean-kaisetu-asset-rebuilds/scripts/revert-noise.sh <noisy-files>`,
  },
};

const emptySubscribe = () => () => {};

export function WebpModal({ isOpen, onClose, locale }: WebpModalProps) {
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [activeTab, setActiveTab] = useState<'preview' | 'cli' | 'raw'>('preview');
  const [langFilter, setLangFilter] = useState<'ja' | 'en'>(
    locale === 'ja' ? 'ja' : 'en'
  );
  const [selectedSnippetKey, setSelectedSnippetKey] = useState<string>('inventory');
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [isCopiedMarkdown, setIsCopiedMarkdown] = useState<boolean>(false);
  const [isCopiedSnippet, setIsCopiedSnippet] = useState<boolean>(false);

  const downloadUrl = '/skills/webp-optimization-guide.skill.md';
  const downloadFilename = 'webp-optimization-guide.skill.md';

  useEffect(() => {
    if (isOpen) {
      // Scroll freeze: lock body at current scroll offset
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        const top = document.body.style.top;
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        if (top) {
          window.scrollTo(0, parseInt(top || '0', 10) * -1);
        }
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !rawMarkdown) {
      fetch(downloadUrl)
        .then((res) => res.text())
        .then((text) => setRawMarkdown(text))
        .catch((err) => console.error('Failed to load WebP guide file:', err));
    }
  }, [isOpen, rawMarkdown, downloadUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const copyMarkdownToClipboard = () => {
    const content = rawMarkdown || 'WebP guide content loading...';
    navigator.clipboard.writeText(content);
    setIsCopiedMarkdown(true);
    setTimeout(() => setIsCopiedMarkdown(false), 2200);
  };

  const copySnippetCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopiedSnippet(true);
    setTimeout(() => setIsCopiedSnippet(false), 2000);
  };

  if (!isOpen || !isClient) return null;

  const currentSnippet = CLI_SNIPPETS[selectedSnippetKey] || CLI_SNIPPETS.inventory;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="webp-modal-title"
    >
      <div className="skill-spec-modal w-full max-w-5xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl rounded-2xl border border-cyan-500/35 bg-[#0b111e] text-slate-100">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800/80 bg-[#070b14]/95 relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 pr-8 sm:pr-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0 shadow-inner mt-0.5">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <h2
                    id="webp-modal-title"
                    className="text-sm sm:text-lg font-bold text-white font-mono break-all sm:break-normal"
                  >
                    kaisetu-webp-conversion.skill.md
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                      Cursor Agent Skill
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                      62.9 KB
                    </span>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-snug line-clamp-2">
                  {langFilter === 'en'
                    ? 'Autonomous WebP conversion, reference synchronization, and asset pruning specification'
                    : '画像のWebP変換・参照パス更新・安全削除を体系化したディレクター・エンジニア向け仕様書'}
                </p>
              </div>
            </div>

            {/* Desktop Close Button */}
            <button
              onClick={onClose}
              className="hidden sm:flex items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 shadow-sm transition-all cursor-pointer shrink-0 active:scale-95 modal-close-btn"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            {/* Mobile Absolute Close Button */}
            <button
              onClick={onClose}
              className="sm:hidden absolute top-3 right-3 flex items-center justify-center p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 shadow-sm transition-all cursor-pointer active:scale-95 modal-close-btn"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-800/50 sm:border-0 sm:mt-2.5 sm:pt-0">
            <button
              onClick={copyMarkdownToClipboard}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Copy entire markdown content"
            >
              {isCopiedMarkdown ? (
                <>
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-400 font-semibold">
                    {locale === 'en' ? 'Copied!' : 'コピー完了'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{locale === 'en' ? 'Copy .md' : 'Markdownコピー'}</span>
                </>
              )}
            </button>

            <a
              href={downloadUrl}
              download={downloadFilename}
              className="modal-download-btn flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Download .md' : 'ダウンロード'}</span>
            </a>
          </div>
        </div>

        {/* Toolbar & Tab Switcher */}
        <div className="px-3.5 sm:px-6 py-2.5 border-b border-slate-800/80 bg-[#080d19]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{langFilter === 'en' ? 'Interactive Guide' : '詳細解説・仕様'}</span>
            </button>
            <button
              onClick={() => setActiveTab('cli')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'cli'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{langFilter === 'en' ? 'CLI Pipeline & Tools' : 'CLI スクリプト & 手順'}</span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'raw'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{langFilter === 'en' ? 'Raw Markdown' : '生Markdown'}</span>
            </button>
          </div>

          {activeTab === 'preview' && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                {langFilter === 'en' ? 'Language View:' : '言語切替:'}
              </span>
              <div className="inline-flex rounded-md p-0.5 bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setLangFilter('ja')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    langFilter === 'ja'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇯🇵 日本語
                </button>
                <button
                  onClick={() => setLangFilter('en')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    langFilter === 'en'
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-sm text-slate-300 leading-relaxed bg-[#0b111e]">
          {/* TAB 1: INTERACTIVE GUIDE */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Banner */}
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/25">
                <div className="flex items-start gap-3">
                  <span className="text-2xl select-none">📘</span>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">
                      Kaisetu WebP 変換ガイド（ディレクター・エンジニア向け）
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {langFilter === 'en' ? (
                        <>
                          Complete operational specification for migrating legacy{' '}
                          <code className="px-1.5 py-0.5 rounded bg-black/60 text-cyan-300 font-mono text-xs border border-cyan-500/20">
                            PNG / JPG / SVG
                          </code>{' '}
                          assets under enterprise platforms to optimized{' '}
                          <code className="px-1.5 py-0.5 rounded bg-black/60 text-emerald-300 font-mono text-xs border border-emerald-500/20">
                            .webp
                          </code>
                          , with synchronized template reference updates, SASS recompilation, and safe
                          asset pruning.
                        </>
                      ) : (
                        <>
                          大規模Webプラットフォーム（
                          <code className="px-1.5 py-0.5 rounded bg-black/60 text-cyan-300 font-mono text-xs border border-cyan-500/20">
                            kaisetu-pack
                          </code>
                          ）で利用されている画像のWebP化を安全に行うための実務ガイド。
                          画像作成だけでなく、PHP/SCSSテンプレートのパス同期、SASS再生成、stylelint自動修正、元画像の安全削除までを9ステップで体系化。
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>{langFilter === 'en' ? '20-40% Smaller' : '20-40% 容量削減'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {langFilter === 'en'
                      ? 'Lossless and visually indistinguishable WebP compression boosting Core Web Vitals.'
                      : '視覚的品質を損なわずにファイルサイズを大幅圧縮し、モバイル表示速度を改善。'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{langFilter === 'en' ? 'Zero Broken Paths' : 'リンク切れ完全防止'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {langFilter === 'en'
                      ? 'Batch inventory scripts map PHP, SCSS, and CSS references before file deletion.'
                      : '事前棚卸しスクリプトでPHPやSCSSの参照を網羅し、リンク切れを物理的に防止。'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <ListOrdered className="w-4 h-4" />
                    <span>{langFilter === 'en' ? '9-Step Verified' : '9ステップの標準フロー'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {langFilter === 'en'
                      ? 'Rigorous multi-breakpoint verification (375px / 768px / 981px+) per route.'
                      : 'ルート単位（reason等）で棚卸し・変換・検証・元画像削除までワンストップで完結。'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Layers className="w-4 h-4" />
                    <span>{langFilter === 'en' ? 'Phased Rollout' : '段階的リリース'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {langFilter === 'en'
                      ? 'Phase 1 Top done; Phase 2 Reason done; safe garbage collection in Phase 3.'
                      : 'トップ検証完了、reason群完了。リスクを最小化するルート別ロールアウト。'}
                  </p>
                </div>
              </div>

              {/* 30-Second Summary Table */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                    <FileText className="w-4 h-4" />
                    <span>
                      {langFilter === 'en' ? '30-Second Executive Summary' : '30秒でわかるプロジェクト概要'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300">
                    Phase 2: Reason Completed ✅
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[12px]">
                      <tr>
                        <td className="py-2.5 px-3 text-cyan-300 font-semibold w-1/4">
                          {langFilter === 'en' ? 'Objective' : '何をしているか'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-200">
                          {langFilter === 'en'
                            ? 'Convert PNG / JPG / SVG assets under /kaisetu/ into lightweight WebP format'
                            : '/kaisetu/ 配下の PNG / JPG / SVG 画像を、より軽量な WebP 形式に置き換える'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-cyan-300 font-semibold">
                          {langFilter === 'en' ? 'Why WebP' : 'なぜやるか'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-200">
                          {langFilter === 'en'
                            ? 'Significant payload drop improving PageSpeed score & LCP mobile metrics'
                            : '画像ファイルが小さくなり、スマートフォン等の表示速度が劇的に高速化'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-cyan-300 font-semibold">
                          {langFilter === 'en' ? 'Files Touched' : '触る対象'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-200">
                          {langFilter === 'en'
                            ? 'Asset files + referencing PHP templates, SCSS source, compiled CSS'
                            : '画像ファイル本体 + 参照している PHP / SCSS / CSS'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-rose-300 font-semibold">
                          {langFilter === 'en' ? 'Out of Scope' : '触らないもの'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {langFilter === 'en'
                            ? 'GIFs, external CDN URLs, WordPress upload media, PHP inline SVG code'
                            : 'GIF、外部CDN画像、WordPressアップロード画像、PHP内インラインSVG'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 9-Step Pipeline Table */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/25 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                  <ListOrdered className="w-4 h-4" />
                  <span>
                    {langFilter === 'en' ? '9-Step Route Rollout Pipeline' : '1ルートあたりの作業の流れ（9ステップ）'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-cyan-400 font-mono font-bold">Step 1</span>
                    <h4 className="font-semibold text-white">画像一覧の取得</h4>
                    <p className="text-[11px] text-slate-400">inventory-images.mjs で参照洗い出し</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-cyan-400 font-mono font-bold">Step 2</span>
                    <h4 className="font-semibold text-white">WebPファイル生成</h4>
                    <p className="text-[11px] text-slate-400">convert-to-webp.mjs で自動生成</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-cyan-400 font-mono font-bold">Step 3</span>
                    <h4 className="font-semibold text-white">コード参照パス更新</h4>
                    <p className="text-[11px] text-slate-400">PHP / SCSS のパスを .webp に書き換え</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-emerald-400 font-mono font-bold">Step 4</span>
                    <h4 className="font-semibold text-white">CSS再生成 & stylelint</h4>
                    <p className="text-[11px] text-slate-400">npx sass + stylelint --fix 実行</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-emerald-400 font-mono font-bold">Step 5-6</span>
                    <h4 className="font-semibold text-white">JS同期 & 残存チェック</h4>
                    <p className="text-[11px] text-slate-400">古い形式の参照が残っていないか再検証</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-amber-400 font-mono font-bold">Step 7</span>
                    <h4 className="font-semibold text-white">マルチ幅ブラウザ確認</h4>
                    <p className="text-[11px] text-slate-400">375px / 768px / 981px+ で欠け崩れ検査</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-rose-400 font-mono font-bold">Step 8</span>
                    <h4 className="font-semibold text-white">元画像の安全削除</h4>
                    <p className="text-[11px] text-slate-400">参照ゼロを確認したPNG/JPGを削除</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-cyan-400 font-mono font-bold">Step 9</span>
                    <h4 className="font-semibold text-white">ノイズ除去 & コミット</h4>
                    <p className="text-[11px] text-slate-400">clean-kaisetu-asset-rebuilds でクリーン化</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-indigo-400 font-mono font-bold">Phase 3</span>
                    <h4 className="font-semibold text-white">迷子ファイルお掃除</h4>
                    <p className="text-[11px] text-slate-400">全ルート完了後に参照ゼロの孤立画像削除</p>
                  </div>
                </div>
              </div>

              {/* Director Pre-Launch Checklist */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  ディレクター・レビュアー向け：公開前チェックリスト
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>スマホ（375px幅）で画像がすべて欠けずに表示されている</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>PC（981px以上）でもKV・本文画像にレイアウト崩れがない</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>別ページで使われている共通画像（kameisystem等）が壊れていない</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>PR差分に関係のないCSS/JSの余計なdiffが混入していない</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLI PIPELINE */}
          {activeTab === 'cli' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(CLI_SNIPPETS).map(([key, snippet]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSnippetKey(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedSnippetKey === key
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {snippet.title.split('(')[0]}
                  </button>
                ))}
              </div>

              {/* Snippet Card */}
              <div className="rounded-xl bg-[#060a12] border border-slate-800 overflow-hidden">
                <div className="p-4 bg-[#090e1a] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 mr-2">
                      {currentSnippet.category}
                    </span>
                    <h4 className="text-sm font-bold text-white inline-block">
                      {currentSnippet.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">{currentSnippet.description}</p>
                  </div>

                  <button
                    onClick={() => copySnippetCode(currentSnippet.code)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
                  >
                    {isCopiedSnippet ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400 font-semibold">
                          {locale === 'en' ? 'Command Copied!' : 'コマンドをコピーしました'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{locale === 'en' ? 'Copy Command' : 'コマンドをコピー'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 overflow-x-auto max-h-[45vh] text-xs font-mono text-slate-200 leading-relaxed">
                  <pre>
                    <code>{currentSnippet.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAW MARKDOWN */}
          {activeTab === 'raw' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  webp-optimization-guide.skill.md • 1,419 lines • 62,934 bytes
                </span>
                <button
                  onClick={copyMarkdownToClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
                >
                  {isCopiedMarkdown ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-cyan-400 font-semibold">
                        {locale === 'en' ? 'Copied!' : 'コピー完了'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'en' ? 'Copy All Markdown' : '全文コピー'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-[#060a12] border border-slate-800 overflow-hidden">
                <div className="p-4 overflow-x-auto max-h-[55vh] text-xs font-mono text-slate-200 leading-relaxed">
                  <pre>
                    <code>{rawMarkdown || 'Loading WebP guide content...'}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Clean Target Path Bar (redundant bottom action buttons removed) */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-[#070b14]/95 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] sm:text-xs min-w-0">
            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
            <span className="truncate">
              Target path:{' '}
              <code className="text-cyan-300">
                ~/.cursor/skills/kaisetu-webp-conversion/SKILL.md
              </code>
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 shrink-0 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-200">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
