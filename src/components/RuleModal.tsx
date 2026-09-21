'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Locale } from '@/types/career';
import {
  X,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Terminal,
  CheckCircle2,
  AlertOctagon,
  FileText,
  Code2,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

const FIX_PATTERNS: Record<
  string,
  { title: string; category: string; description: string; code: string }
> = {
  fix1: {
    title: 'Fix 1: Text That Should Wrap',
    category: 'Typography & Long URLs',
    description:
      'Prevents long strings, URLs, and emails from breaking out of text containers.',
    code: `.text-container {
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}`,
  },
  fix2: {
    title: 'Fix 2: Single-line Truncate',
    category: 'Text Truncation',
    description:
      'Safely truncates text with an ellipsis. Notice min-width: 0 is essential when inside flex/grid.',
    code: `.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}`,
  },
  fix3: {
    title: 'Fix 3: Multi-line Clamp',
    category: 'Text Clamping',
    description:
      'Clamps long body copy or cards to a specified number of lines across all modern browsers.',
    code: `.clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`,
  },
  fix4: {
    title: 'Fix 4: Button Max Width + Truncation',
    category: 'Buttons & CTAs',
    description:
      'Prevents buttons from growing infinitely on wide screens while supporting wrap buttons.',
    code: `button, .btn {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

button.wrap-btn {
  white-space: normal;
  word-break: break-word;
  height: auto;
}`,
  },
  fix4a: {
    title: 'Fix 4a: Div/Button CTA Text Refinement',
    category: 'CTA Principles',
    description:
      'Best practice rules for marketing CTAs: never rewrite copy; inspect sibling buttons; reserve arrow space.',
    code: `/* Rules for CTA Buttons:
 1. Never rewrite or shorten visible copy unless explicitly requested.
 2. Preserve visual parity with sibling buttons in the same container.
 3. Prefer scoped class on elongated button; minimal CSS changes.
 4. Reserve right padding for absolute-positioned arrow icons.
 5. Test narrow mobile viewports (iPhone SE / 375px).
*/
.cta-button--scoped {
  padding-right: 2.75rem; /* space for icon */
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  white-space: normal;
  word-break: break-word;
}`,
  },
  fix5: {
    title: 'Fix 5: Flex Row With Multiple Buttons',
    category: 'Flexbox Layouts',
    description:
      'Enables responsive wrapping and flex-basis sizing for button rows without overflow.',
    code: `.button-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
}

.button-row button {
  flex: 1 1 auto;
  min-width: 80px;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`,
  },
  fix6: {
    title: 'Fix 6: Flex / Grid Child Container',
    category: 'Flex/Grid Blowout Prevention',
    description:
      'The crucial min-width: 0 safeguard preventing flex/grid children from expanding past parent boundaries.',
    code: `.flex-parent {
  display: flex;
  min-width: 0;
}

.flex-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`,
  },
  fix7: {
    title: 'Fix 7: Card / List Item in Grid',
    category: 'Grid Cards',
    description:
      'Prevents cards in CSS Grid from expanding columns when internal content is wider than minmax.',
    code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.grid-item {
  min-width: 0;
  overflow: hidden;
}

.grid-item p,
.grid-item span {
  overflow-wrap: break-word;
}`,
  },
  fix8: {
    title: 'Fix 8: Images and Media',
    category: 'Media Elements',
    description:
      'Ensures embedded media, images, SVGs, and iframes scale within responsive containers.',
    code: `img, video, iframe, svg {
  max-width: 100%;
  height: auto;
  display: block;
}`,
  },
  tailwind: {
    title: 'Tailwind Utility Equivalents',
    category: 'Modern CSS Framework',
    description: 'Direct Tailwind CSS classes corresponding to the audit rule fixes.',
    code: `/* Tailwind CSS Equivalents */
.break-words        /* overflow-wrap: break-word; */
.truncate           /* overflow: hidden; text-overflow: ellipsis; white-space: nowrap; */
.line-clamp-2       /* display: -webkit-box; -webkit-line-clamp: 2; ... */
.min-w-0            /* min-width: 0; (Flex/Grid blowout fix) */
.max-w-xs           /* max-width: 20rem; */
.flex-wrap          /* flex-wrap: wrap; */
.w-full.h-auto      /* max-width: 100%; height: auto; */`,
  },
};

const emptySubscribe = () => () => {};

export function RuleModal({ isOpen, onClose, locale }: RuleModalProps) {
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [activeTab, setActiveTab] = useState<'preview' | 'fixes' | 'raw'>('preview');
  const [langFilter, setLangFilter] = useState<'ja' | 'en'>(
    locale === 'ja' ? 'ja' : 'en'
  );
  const [selectedFixKey, setSelectedFixKey] = useState<string>('fix6');
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [isCopiedMarkdown, setIsCopiedMarkdown] = useState<boolean>(false);
  const [isCopiedFix, setIsCopiedFix] = useState<boolean>(false);

  const downloadUrl = '/rules/responsive-text-audit.rule.md';
  const downloadFilename = 'responsive-text-audit.rule.md';

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
        .catch((err) => console.error('Failed to load rule file:', err));
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
    const content = rawMarkdown || 'Rule content loading...';
    navigator.clipboard.writeText(content);
    setIsCopiedMarkdown(true);
    setTimeout(() => setIsCopiedMarkdown(false), 2200);
  };

  const copyFixCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopiedFix(true);
    setTimeout(() => setIsCopiedFix(false), 2000);
  };

  if (!isOpen || !isClient) return null;

  const currentFix = FIX_PATTERNS[selectedFixKey] || FIX_PATTERNS.fix6;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rule-modal-title"
    >
      <div className="skill-spec-modal w-full max-w-5xl h-[86vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl rounded-2xl border border-emerald-500/35 bg-[#0b111e] text-slate-100">
        {/* Modal Header */}
        <div className="p-3 sm:p-5 border-b border-slate-800/80 bg-[#070b14]/95">
          {/* Top Row: Icon + Title + Badge + Inline Close Button */}
          <div className="flex items-start justify-between gap-2.5 sm:gap-4">
            <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 shadow-inner mt-0.5">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5">
                  <h2
                    id="rule-modal-title"
                    className="text-xs sm:text-lg font-bold text-white font-mono break-all sm:break-normal"
                  >
                    responsive-text-audit.rule.md
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                    Cursor Rule (.mdc)
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                    28.5 KB
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-1 sm:line-clamp-none">
                  {langFilter === 'en'
                    ? 'Autonomous CSS/SCSS layout auditor preventing text overflow and container blowout'
                    : 'テキストはみ出し・コンテナ破壊・CTA崩れを未然に防ぐCursor Agent 監査Rule'}
                </p>
              </div>
            </div>

            {/* Desktop & Mobile Unified Close Button - Always neatly positioned on top-right */}
            <button
              onClick={onClose}
              className="flex items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 shadow-sm transition-all cursor-pointer shrink-0 active:scale-95 modal-close-btn"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Action Row: Copy, Download & Language Switcher */}
          <div className="flex items-center gap-2 mt-2.5 sm:mt-3 pt-2.5 border-t border-slate-800/60 sm:border-0 sm:pt-0">
            <button
              onClick={copyMarkdownToClipboard}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Copy entire rule markdown"
            >
              {isCopiedMarkdown ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">
                    {locale === 'en' ? 'Copied!' : 'コピー完了'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{locale === 'en' ? 'Copy Rule' : 'Ruleコピー'}</span>
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

            {/* Language Switcher */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-slate-800 ml-auto shrink-0">
              <button
                onClick={() => setLangFilter('ja')}
                className={`px-2 py-1 rounded text-[10px] sm:text-[11px] font-medium transition-colors cursor-pointer ${
                  langFilter === 'ja'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇯🇵
              </button>
              <button
                onClick={() => setLangFilter('en')}
                className={`px-2 py-1 rounded text-[10px] sm:text-[11px] font-medium transition-colors cursor-pointer ${
                  langFilter === 'en'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇬🇧
              </button>
            </div>
          </div>
        </div>

        {/* Toolbar & Tabs */}
        <div className="px-3 sm:px-6 py-2 border-b border-slate-800/80 bg-[#080d19]/90 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-lg bg-slate-900 border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{langFilter === 'en' ? 'Overview' : '概要・要点'}</span>
            </button>
            <button
              onClick={() => setActiveTab('fixes')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'fixes'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{langFilter === 'en' ? 'CSS Fixes' : '修正パターン'}</span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'raw'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{langFilter === 'en' ? 'Raw Rule' : '生Rule'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0b111e]">
          {/* TAB 1: INTERACTIVE GUIDE & OVERVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Top Banner */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="text-xl sm:text-2xl select-none">📌</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                      responsive-text-audit.mdc
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {langFilter === 'en' ? (
                        <>
                          Production Cursor Agent Rule enforcing layout robustness across{' '}
                          <code className="px-1.5 py-0.5 rounded bg-black/60 text-emerald-300 font-mono text-[11px] sm:text-xs border border-emerald-500/20">
                            HTML, PHP, CSS, SCSS, JSX, TSX, Vue
                          </code>
                          . Proactively audits for text overflow, button size inflation, and
                          flex/grid child container blowout, applying scoped fixes in source SCSS.
                        </>
                      ) : (
                        <>
                          <code className="px-1.5 py-0.5 rounded bg-black/60 text-emerald-300 font-mono text-[11px] sm:text-xs border border-emerald-500/20">
                            ibjap-design
                          </code>{' '}
                          などの大規模WordPress/PHP/フロントエンド開発において、動的テキストの突き抜け、ボタンやカードの意図しない肥大化、flex/gridのコンテナ破壊を自動検知し、他ページへの副作用を起こさないようソースSCSSで安全に修正するCursor Rule。
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Option B Mobile Summary Cards (< sm) */}
              <div className="sm:hidden space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{langFilter === 'en' ? 'Zero Blowout Safeguard' : 'コンテナ破壊ゼロの徹底'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {langFilter === 'en'
                      ? 'Automates min-width: 0 on flex/grid children containing dynamic text to prevent layout breaks.'
                      : 'flex/gridで漏れがちな min-width: 0 を徹底し、動的長文による横スクロール・突き抜けをゼロに。'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{langFilter === 'en' ? 'CTA Preservation & Copy Lock' : '文言改ざん禁止 & CTA保護'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {langFilter === 'en'
                      ? 'Strictly forbids shortening marketing copy; guarantees arrow spacing and button alignment.'
                      : 'ボタンや文言の勝手な省略・短縮を禁止。矢印アイコンの余白を保ちつつ破綻のない折り返しを実現。'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{langFilter === 'en' ? 'Scoped Source SCSS' : 'ソースSCSSへの局所適用'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    {langFilter === 'en'
                      ? 'Injects fixes into template-linked SCSS, protecting shared new-common/top stylesheets.'
                      : '共通スタイルを汚さず、テンプレート固有のソースSCSSにスコープ付きで安全にパッチを適用。'}
                  </p>
                </div>

                {/* Mobile Quick Navigation Card */}
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-cyan-200">
                      {langFilter === 'en' ? 'Ready to see code solutions?' : '実装コードを確認する'}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {langFilter === 'en' ? '8 production-tested CSS patterns' : '8種類の検証済みCSS修正パターン'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('fixes')}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                  >
                    {langFilter === 'en' ? 'View Fixes →' : 'パターン →'}
                  </button>
                </div>
              </div>

              {/* Desktop 4 Pillars Grid (>= sm) */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{langFilter === 'en' ? 'Zero Blowout' : 'コンテナ破壊ゼロ'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {langFilter === 'en'
                      ? 'Standardizes min-width: 0 on flex/grid children containing dynamic text.'
                      : 'flex/gridの子要素で漏れがちなmin-width: 0を徹底しレイアウト崩れを防ぐ。'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>{langFilter === 'en' ? 'CTA Preservation' : 'CTAの一貫性維持'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {langFilter === 'en'
                      ? 'Never shortens copy; ensures button rows and arrow icons stay visually aligned.'
                      : 'ボタン文言を勝手に短縮せず、矢印アイコンの余白や兄弟ボタンとの整合を保持。'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Terminal className="w-4 h-4" />
                    <span>{langFilter === 'en' ? 'SCSS Isolation' : 'SCSSスコープ隔離'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {langFilter === 'en'
                      ? 'Enforces template-linked SCSS, protecting shared new-common/new-top stylesheets.'
                      : '共有ファイルへの直書きを禁止し、PHP紐づきSCSSまたは独自クラスに限定。'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{langFilter === 'en' ? 'Multi-Framework' : 'マルチ構文対応'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {langFilter === 'en'
                      ? 'Seamless support for PHP templates, SCSS, Tailwind, and React JSX/TSX.'
                      : 'WordPress PHPからNext.js/React、Tailwindユーティリティまで一貫対応。'}
                  </p>
                </div>
              </div>

              {/* Safeguards & Risk Matrix */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {langFilter === 'en'
                        ? 'Missing Responsive Safeguards & Risks'
                        : '必須セーフガードと放置リスク一覧'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {langFilter === 'en' ? 'Core CSS Properties' : '主要CSSプロパティ'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] text-slate-400 border-b border-slate-800 uppercase font-mono">
                      <tr>
                        <th className="py-2 px-3">Property</th>
                        <th className="py-2 px-3">Missing from</th>
                        <th className="py-2 px-3">Production Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[12px]">
                      <tr>
                        <td className="py-2.5 px-3 text-emerald-300 font-semibold">
                          overflow-wrap: break-word
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">Text containers</td>
                        <td className="py-2.5 px-3 text-rose-400">
                          Long strings & URLs overflow screen
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-cyan-300 font-semibold">min-width: 0</td>
                        <td className="py-2.5 px-3 text-slate-300">Flex/grid children</td>
                        <td className="py-2.5 px-3 text-rose-400">
                          Content blows out entire container width
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-amber-300 font-semibold">
                          max-width: 100%
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">Images, SVGs, iframes</td>
                        <td className="py-2.5 px-3 text-rose-400">
                          Media causes horizontal page scroll
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-indigo-300 font-semibold">
                          text-overflow: ellipsis
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">Truncated elements</td>
                        <td className="py-2.5 px-3 text-amber-400">
                          Text clips without visual truncation hint
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-emerald-300 font-semibold">
                          flex-shrink: 0 / auto
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">Button / icon rows</td>
                        <td className="py-2.5 px-3 text-amber-400">
                          Buttons squish or disappear on mobile
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Behavior Rules & Precautions */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/25 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                  <AlertOctagon className="w-4 h-4 text-emerald-400" />
                  <span>
                    {langFilter === 'en'
                      ? 'Precautions & Behavior Rules (Hard Guards)'
                      : '注意事項・行動原則（ハードガード）'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-slate-200">
                    <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-rose-300">
                        {langFilter === 'en' ? 'Copy Lock: ' : '文言改ざん禁止: '}
                      </strong>
                      {langFilter === 'en'
                        ? 'NEVER shorten or rewrite button/marketing copy unless explicitly commanded'
                        : 'ユーザー明示指示時を除き、ボタンや文言の短縮・書き換えは厳禁'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-emerald-300">
                        {langFilter === 'en' ? 'Source Stylesheet First: ' : 'ソースSCSS優先: '}
                      </strong>
                      {langFilter === 'en'
                        ? 'Place fixes in source SCSS templates rather than generated build output'
                        : 'ビルド済みCSSではなく、テンプレートに紐づくソースSCSSに修正を配置'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-slate-200">
                    <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-rose-300">
                        {langFilter === 'en' ? 'Shared CSS Protection: ' : '共有CSSの保護: '}
                      </strong>
                      {langFilter === 'en'
                        ? 'Never inject page-specific hacks into new-common.scss or new-top.scss'
                        : 'new-common.scss / new-top.scss へのページ固有直接修正は禁止'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-emerald-300">
                        {langFilter === 'en' ? 'Audit Reporting: ' : '監査レポート形式: '}
                      </strong>
                      {langFilter === 'en'
                        ? 'Reports with `RESPONSIVENESS AUDIT - [filename]` and flags manual reviews'
                        : 'RESPONSIVENESS AUDIT形式で報告し、設計判断が必要な箇所はMANUAL REVIEW明記'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bilingual Details */}
              {langFilter === 'ja' && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                    <span>🇯🇵</span>
                    <span>実務における効果と運用フロー</span>
                  </div>
                  <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                    <p>
                      <strong>なぜこのRuleを定義したのか：</strong>{' '}
                      複数人体制の大規模WordPress案件やレガシー刷新では、CSSの改修が思わぬ他ページに影響（リグレッション）を与えるリスクが常にあります。また、動的コンテンツ（長文URLやユーザー名）による画面突き抜けは、ステージング検証で見落とされがちです。
                    </p>
                    <p>
                      本Ruleを導入することで、Cursorがテンプレート改修時に自動でレイアウト監査を実施。
                      <code>min-width: 0</code> の補完やCTAボタンの折り返し設計を統一し、レビュー工数と手戻りを激減させました。
                    </p>
                  </div>
                </div>
              )}

              {langFilter === 'en' && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                    <span>🇬🇧</span>
                    <span>Engineering Background & Architectural Impact</span>
                  </div>
                  <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                    <p>
                      <strong>Why this Rule was architected:</strong> In enterprise CMS migrations and multi-page platforms, responsive layout bugs frequently stem from simple CSS omissions: unconstrained flex items, missing word breaks on dynamic user input, and unintended side-effects when editing shared stylesheets.
                    </p>
                    <p>
                      This Cursor Rule codifies senior frontend audit principles into an automated prompt rule, ensuring AI code generation always respects source SCSS hierarchy, preserves button design semantics, and enforces bulletproof container boundaries across all screen sizes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FIXES & CHECKLIST */}
          {activeTab === 'fixes' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(FIX_PATTERNS).map(([key, pattern]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFixKey(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedFixKey === key
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {pattern.title.split(':')[0]}
                  </button>
                ))}
              </div>

              {/* Fix Card */}
              <div className="rounded-xl bg-[#060a12] border border-slate-800 overflow-hidden">
                <div className="p-4 bg-[#090e1a] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 mr-2">
                      {currentFix.category}
                    </span>
                    <h4 className="text-sm font-bold text-white inline-block">
                      {currentFix.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">{currentFix.description}</p>
                  </div>

                  <button
                    onClick={() => copyFixCode(currentFix.code)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
                  >
                    {isCopiedFix ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">
                          {locale === 'en' ? 'Code Copied!' : 'コードをコピーしました'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{locale === 'en' ? 'Copy Snippet' : 'スニペットをコピー'}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 overflow-x-auto max-h-[45vh] text-xs font-mono text-slate-200 leading-relaxed">
                  <pre>
                    <code>{currentFix.code}</code>
                  </pre>
                </div>
              </div>

              {/* Checklist Section */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Audit Checklist Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Dynamic text has overflow-wrap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Flex/grid children have min-width: 0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Buttons have max-width or wrap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Icon + text buttons work at 375px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Cards have overflow: hidden</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Images: max-width 100%, height auto</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAW RULE */}
          {activeTab === 'raw' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  responsive-text-audit.rule.md • 733 lines • 28,476 bytes
                </span>
                <button
                  onClick={copyMarkdownToClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
                >
                  {isCopiedMarkdown ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">
                        {locale === 'en' ? 'Copied!' : 'コピー完了'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{locale === 'en' ? 'Copy All Rule Markdown' : '全文コピー'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-[#060a12] border border-slate-800 overflow-hidden">
                <div className="p-4 overflow-x-auto max-h-[55vh] text-xs font-mono text-slate-200 leading-relaxed">
                  <pre>
                    <code>{rawMarkdown || 'Loading rule content...'}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Clean Target Path Bar (redundant bottom action buttons removed) */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-[#070b14]/95 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] sm:text-xs min-w-0">
            <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span className="truncate">
              Target path:{' '}
              <code className="text-emerald-300">
                ~/.cursor/rules/responsive-text-audit.mdc
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
