'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Locale } from '@/types/career';
import {
  X,
  Download,
  Copy,
  Check,
  Zap,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  FolderTree,
  ListOrdered,
  FileText,
  Code2,
} from 'lucide-react';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

const SCRIPT_FIND_WEBPACK_NOISE = `#!/usr/bin/env node
'use strict';

/*
 * find-webpack-noise.js
 *
 * Detects webpack-only noise in kaisetu-pack/assets/ by comparing modified
 * asset files (per \`git status\`) against the source -> output mapping
 * derived from kaisetu-pack/webpack.config.js.
 *
 * Output (JSON to stdout):
 *   {
 *     "intended":  [...],
 *     "unintended":[...],
 *     "unmapped":  [...]
 *   }
 *
 * Run from the ibjap-design repo root.
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function fail(msg, code = 1) {
  process.stderr.write(\`find-webpack-noise: \${msg}\\n\`);
  process.exit(code);
}

const repoRoot = process.cwd();
const webpackConfigPath = path.join(repoRoot, 'kaisetu-pack', 'webpack.config.js');
if (!fs.existsSync(webpackConfigPath)) {
  fail(\`expected \${webpackConfigPath} to exist; cd into the ibjap-design repo root first.\`);
}

const kaisetuPackDir = path.join(repoRoot, 'kaisetu-pack');
process.chdir(kaisetuPackDir);
let configs;
try {
  configs = require(webpackConfigPath);
} catch (e) {
  fail(\`failed to load webpack.config.js: \${e.message}\\nDid you run \\\`npm install\\\` in kaisetu-pack/?\`);
}
process.chdir(repoRoot);

if (!Array.isArray(configs)) {
  configs = [configs];
}

const outputToSources = new Map();

function normalizeSource(entry) {
  const abs = path.resolve(kaisetuPackDir, entry);
  return path.relative(repoRoot, abs);
}

function addOutput(outputFilename, sources) {
  if (!outputFilename) return;
  const outputPath = path.posix.join('kaisetu-pack', 'assets', outputFilename);
  if (!outputToSources.has(outputPath)) {
    outputToSources.set(outputPath, new Set());
  }
  const set = outputToSources.get(outputPath);
  sources.forEach((s) => set.add(s));
}

for (const cfg of configs) {
  if (!cfg || !cfg.entry) continue;
  const entries = Array.isArray(cfg.entry) ? cfg.entry : [cfg.entry];
  const sources = entries.map(normalizeSource);
  if (cfg.output && cfg.output.filename) {
    addOutput(cfg.output.filename, sources);
  }
  if (Array.isArray(cfg.plugins)) {
    for (const plugin of cfg.plugins) {
      if (!plugin || typeof plugin !== 'object') continue;
      const ctorName = plugin.constructor && plugin.constructor.name;
      if (ctorName !== 'MiniCssExtractPlugin') continue;
      const cssFilename = plugin.options && plugin.options.filename;
      if (cssFilename) addOutput(cssFilename, sources);
    }
  }
}

let statusOut;
try {
  statusOut = execSync('git status --short --untracked-files=no -- kaisetu-pack/', {
    cwd: repoRoot,
    encoding: 'utf8',
  });
} catch (e) {
  fail(\`git status failed: \${e.message}\`);
}

const modifiedSources = new Set();
const modifiedAssets = new Set();

for (const rawLine of statusOut.split('\\n')) {
  if (!rawLine.trim()) continue;
  const status = rawLine.slice(0, 2);
  const file = rawLine.slice(3).trim();
  if (status.includes('?')) continue;
  if (file.startsWith('kaisetu-pack/src/')) {
    modifiedSources.add(file);
  } else if (file.startsWith('kaisetu-pack/assets/')) {
    modifiedAssets.add(file);
  }
}

const intended = [];
const unintended = [];
const unmapped = [];

for (const asset of [...modifiedAssets].sort()) {
  const sources = outputToSources.get(asset);
  if (!sources) {
    unmapped.push(asset);
    continue;
  }
  let anySourceModified = false;
  for (const src of sources) {
    if (modifiedSources.has(src)) {
      anySourceModified = true;
      break;
    }
  }
  if (anySourceModified) {
    intended.push(asset);
  } else {
    unintended.push(asset);
  }
}

process.stdout.write(JSON.stringify({ intended, unintended, unmapped }, null, 2) + '\\n');`;

const SCRIPT_REVERT_NOISE = `#!/usr/bin/env bash
#
# revert-noise.sh
#
# Reverts the given files via \`git checkout HEAD --\`.
# Refuses any path that is not under kaisetu-pack/assets/ as a safety net,
# even if the agent's detector script slipped up.
#
# Usage:
#   revert-noise.sh kaisetu-pack/assets/foo.css kaisetu-pack/assets/bar.js ...

set -euo pipefail

if [[ $# -eq 0 ]]; then
  echo "revert-noise: no files given, nothing to do." >&2
  exit 0
fi

if [[ ! -f kaisetu-pack/webpack.config.js ]]; then
  echo "revert-noise: must be run from the ibjap-design repo root (kaisetu-pack/webpack.config.js not found)." >&2
  exit 2
fi

for arg in "$@"; do
  case "$arg" in
    kaisetu-pack/assets/*) ;;
    *)
      echo "revert-noise: refusing to revert '$arg' — only paths under kaisetu-pack/assets/ are allowed." >&2
      exit 3
      ;;
  esac
  if [[ "$arg" == *".."* ]]; then
    echo "revert-noise: refusing path containing '..': '$arg'" >&2
    exit 3
  fi
done

git checkout HEAD -- "$@"

echo "Reverted \${#} file(s):"
for arg in "$@"; do
  echo "  - $arg"
done`;

const emptySubscribe = () => () => {};

export function SkillModal({ isOpen, onClose, locale }: SkillModalProps) {
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [activeTab, setActiveTab] = useState<'preview' | 'raw' | 'scripts'>('preview');
  const [langFilter, setLangFilter] = useState<'all' | 'ja' | 'en'>(locale === 'ja' ? 'ja' : 'en');
  const [selectedScript, setSelectedScript] = useState<'find' | 'revert'>('find');
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [isCopiedMarkdown, setIsCopiedMarkdown] = useState<boolean>(false);
  const [copiedScriptKey, setCopiedScriptKey] = useState<string | null>(null);

  const downloadUrl = '/skills/clean-kaisetu-asset-rebuilds.skill.md';
  const downloadFilename = 'clean-kaisetu-asset-rebuilds.skill.md';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      if (!rawMarkdown) {
        fetch(downloadUrl)
          .then((res) => res.text())
          .then((text) => setRawMarkdown(text))
          .catch((err) => console.error('Failed to load skill file:', err));
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
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
    const content = rawMarkdown || 'Skill content loading...';
    navigator.clipboard.writeText(content);
    setIsCopiedMarkdown(true);
    setTimeout(() => setIsCopiedMarkdown(false), 2200);
  };

  const copyScriptToClipboard = (key: 'find' | 'revert', code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedScriptKey(key);
    setTimeout(() => setCopiedScriptKey(null), 2000);
  };

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-modal-title"
    >
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl rounded-2xl border border-amber-500/35 bg-[#0b111e] text-slate-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-[#070b14]/95">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0 shadow-inner">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2
                  id="skill-modal-title"
                  className="text-base sm:text-lg font-bold text-white font-mono truncate"
                >
                  clean-kaisetu-asset-rebuilds.skill.md
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  Cursor Agent Skill
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                  19.9 KB
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate">
                {locale === 'en'
                  ? 'Autonomous Webpack noise detector and pre-commit cleanup tool for enterprise assets'
                  : 'webpack再ビルドによる不要な差分（ノイズ）を自動検出し、コミット前に安全に元に戻す自作Skill'}
              </p>
            </div>
          </div>

          {/* Action buttons in header */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            <button
              onClick={copyMarkdownToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all cursor-pointer shadow-sm"
              title="Copy entire markdown content"
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
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{locale === 'en' ? 'Copy .md' : 'Markdownコピー'}</span>
                </>
              )}
            </button>

            <a
              href={downloadUrl}
              download={downloadFilename}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Download .md' : 'ダウンロード'}</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher & Filter Toolbar */}
        <div className="px-4 sm:px-6 py-2.5 border-b border-slate-800/80 bg-[#080d19]/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Interactive Guide' : '詳細解説・仕様'}</span>
            </button>
            <button
              onClick={() => setActiveTab('scripts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'scripts'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Bundled Scripts' : '付属スクリプト'}</span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'raw'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{locale === 'en' ? 'Raw Markdown' : '生Markdown'}</span>
            </button>
          </div>

          {/* Language filter for preview tab */}
          {activeTab === 'preview' && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                {locale === 'en' ? 'Language View:' : '言語切替:'}
              </span>
              <div className="inline-flex rounded-md p-0.5 bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setLangFilter('all')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    langFilter === 'all'
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {locale === 'en' ? 'Both (Full)' : '全文 (日英)'}
                </button>
                <button
                  onClick={() => setLangFilter('ja')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    langFilter === 'ja'
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇯🇵 日本語
                </button>
                <button
                  onClick={() => setLangFilter('en')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    langFilter === 'en'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-sm text-slate-300 leading-relaxed bg-[#0b111e]">
          {/* TAB 1: INTERACTIVE GUIDE */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Top Banner & Core Purpose */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
                <div className="flex items-start gap-3">
                  <span className="text-2xl select-none">🧹</span>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">
                      clean-kaisetu-asset-rebuilds
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {langFilter === 'en' ? (
                        <>
                          A high-safety Cursor Agent Skill that detects CSS/JS files in{' '}
                          <code className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono text-xs border border-amber-500/20">
                            kaisetu-pack/assets/
                          </code>{' '}
                          rebuilt by Webpack without any underlying SCSS/JS edits, reverting them
                          safely with{' '}
                          <code className="px-1.5 py-0.5 rounded bg-black/60 text-cyan-300 font-mono text-xs border border-cyan-500/20">
                            git checkout HEAD --
                          </code>{' '}
                          after interactive user confirmation.
                        </>
                      ) : (
                        <>
                          <code className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono text-xs border border-amber-500/20">
                            ibjap-design
                          </code>{' '}
                          リポジトリで{' '}
                          <code className="px-1.5 py-0.5 rounded bg-black/60 text-cyan-300 font-mono text-xs border border-cyan-500/20">
                            npm run dev:prod
                          </code>{' '}
                          を実行後、編集していない SCSS/JS から再ビルドされてしまった{' '}
                          <code className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono text-xs border border-amber-500/20">
                            assets/
                          </code>{' '}
                          配下のCSS/JS（autoprefixer/minifier由来のノイズ差分）を自動検出し、PRをノイズ汚染から守るクリーンアップ専用スキル。
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Zap className="w-4 h-4" />
                    <span>{locale === 'en' ? 'Minutes → Seconds' : '工数短縮'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {locale === 'en'
                      ? 'Eliminates manual pre-commit asset file triage and git diff review.'
                      : 'コミット前の手動選別作業をゼロにし、PRレビューを実変更に集中化。'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{locale === 'en' ? 'Strict Hard Guards' : '安全ガード'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {locale === 'en'
                      ? 'Strictly scoped to assets/. Cannot touch src/, configs, or untracked files.'
                      : '操作対象をassets/のみに限定。srcや設定ファイルへの誤爆を物理的に防止。'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{locale === 'en' ? 'Human-in-the-Loop' : '対話型確認'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {locale === 'en'
                      ? 'Never auto-reverts. Previews intended vs unintended diffs first.'
                      : '自動revert禁止。分類プレビューを表示しユーザー確認後にのみ実行。'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                    <Terminal className="w-4 h-4" />
                    <span>{locale === 'en' ? 'Webpack AST Mapping' : '設定マップ解析'}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {locale === 'en'
                      ? 'Parses webpack.config.js entries and MiniCssExtractPlugin mapping.'
                      : 'webpack.config.jsのエントリを読み込みソースと出力の依存関係を解決。'}
                  </p>
                </div>
              </div>

              {/* Hard Constraints Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/25 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {langFilter === 'en'
                      ? 'Hard Constraints & Safety Protections'
                      : 'ハード制約（安全装置）'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-emerald-300">
                        {langFilter === 'en' ? 'Target Isolation: ' : '対象ファイル限定: '}
                      </strong>
                      {langFilter === 'en'
                        ? 'Only operates on files strictly under kaisetu-pack/assets/'
                        : 'kaisetu-pack/assets/ 配下のファイルのみを操作'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-slate-200">
                    <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-rose-300">
                        {langFilter === 'en' ? 'Source Protection: ' : 'ソース保護: '}
                      </strong>
                      {langFilter === 'en'
                        ? 'NEVER touches kaisetu-pack/src/, webpack.config.js, or wp_core/'
                        : 'src/, webpack.config.js, wp_core/ 等は絶対に触らない'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-slate-200">
                    <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-rose-300">
                        {langFilter === 'en' ? 'No Auto-Revert: ' : '自動実行の禁止: '}
                      </strong>
                      {langFilter === 'en'
                        ? 'Always shows three-bucket preview before requesting explicit approval'
                        : '必ずプレビューを出してユーザーに確認を取る'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-emerald-300">
                        {langFilter === 'en' ? 'Git State Safety: ' : 'Git整合性チェック: '}
                      </strong>
                      {langFilter === 'en'
                        ? 'Never touches untracked files. Requires ibjap-design repo root'
                        : 'untrackedファイルは削除せず、リポジトリルート判定を厳格化'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 6-Step Workflow Pipeline */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                    <ListOrdered className="w-4 h-4" />
                    <span>
                      {langFilter === 'en' ? 'Execution Workflow (6 Steps)' : '実行ワークフロー（6ステップ）'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Detector → Preview → Confirm → Safe Revert
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-cyan-400 font-mono font-bold">Step 1</span>
                    <h4 className="font-semibold text-white">
                      {langFilter === 'en' ? 'Verify Working Dir' : 'cwd リポジトリ確認'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {langFilter === 'en'
                        ? 'Confirms webpack.config.js exists in kaisetu-pack/'
                        : 'ibjap-design ルートに存在するか検証'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-cyan-400 font-mono font-bold">Step 2</span>
                    <h4 className="font-semibold text-white">
                      {langFilter === 'en' ? 'Run Detector' : '検出スクリプト実行'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {langFilter === 'en'
                        ? 'Executes find-webpack-noise.js to inspect git diffs'
                        : 'find-webpack-noise.js で差分をマッピング'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-cyan-400 font-mono font-bold">Step 3</span>
                    <h4 className="font-semibold text-white">
                      {langFilter === 'en' ? '3-Bucket Preview' : '分類プレビュー表示'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      <span className="text-emerald-300 font-mono">intended</span> /{' '}
                      <span className="text-amber-300 font-mono">unintended</span> /{' '}
                      <span className="text-cyan-300 font-mono">unmapped</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-amber-400 font-mono font-bold">Step 4</span>
                    <h4 className="font-semibold text-white">
                      {langFilter === 'en' ? 'User Confirmation' : 'ユーザー確認'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {langFilter === 'en'
                        ? 'Agent asks for confirmation before any checkout'
                        : 'ノイズ差分のrevert実行可否を人間が承認'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-amber-400 font-mono font-bold">Step 5</span>
                    <h4 className="font-semibold text-white">
                      {langFilter === 'en' ? 'Guarded Revert' : '安全Revert実行'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {langFilter === 'en'
                        ? 'revert-noise.sh runs checkout only on confirmed assets'
                        : 'revert-noise.sh 経由で git checkout HEAD --'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 space-y-1">
                    <span className="text-emerald-400 font-mono font-bold">Step 6</span>
                    <h4 className="font-semibold text-white">
                      {langFilter === 'en' ? 'Final Status' : 'クリーン差分確認'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {langFilter === 'en'
                        ? 'git status --short shows clean, intentional diff only'
                        : 'git status で本物の変更のみが残ったことを確認'}
                    </p>
                  </div>
                </div>
              </div>

              {/* File Layout Tree */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                  <FolderTree className="w-4 h-4" />
                  <span>
                    {langFilter === 'en' ? 'Skill Directory Structure' : 'スキル配置構成'}
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#060a12] font-mono text-xs text-slate-300 border border-slate-800/80">
                  <pre className="overflow-x-auto leading-relaxed">
{`~/.cursor/skills/clean-kaisetu-asset-rebuilds/
├── SKILL.md                          # Skill spec & frontmatter
└── scripts/
    ├── find-webpack-noise.js         # Node.js detector (source -> output mapping)
    └── revert-noise.sh               # Bash revert executor with safety net`}
                  </pre>
                </div>
              </div>

              {/* Bilingual Detailed Explanations */}
              {(langFilter === 'all' || langFilter === 'ja') && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <span>🇯🇵</span>
                    <span>プロジェクト背景 & ノイズ発生のメカニズム</span>
                  </div>
                  <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                    <p>
                      <strong>なぜこのスキルが必要か：</strong>{' '}
                      <code>kaisetu-pack/</code> で <code>npm run dev:prod</code> を走らせると、
                      webpack の <code>--watch</code> が全 entry を再ビルドします。
                      ソース（<code>kaisetu-pack/src/</code>）を全く編集していなくても、出力先（<code>kaisetu-pack/assets/</code>）が
                      autoprefixer や minifier の差分（実質的にノイズ）だけで更新され、
                      <code>git status</code> に modified としてずらりと並びます。
                    </p>
                    <p>
                      そのままコミットしてしまうと、PRが「実は何も変えていない asset の diff」で埋め尽くされ、
                      レビュアーの負担が激増します。本スキルは、それらのノイズ差分を機械的に判定し、
                      本来レビューすべきコード変更だけにクリーンアップする実務直結のツールです。
                    </p>
                  </div>
                </div>
              )}

              {(langFilter === 'all' || langFilter === 'en') && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                    <span>🇬🇧</span>
                    <span>Engineering Background & Root Cause</span>
                  </div>
                  <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                    <p>
                      <strong>Why webpack is run:</strong> Webpack compiles and bundles SCSS/JS assets into deployable CSS/JS for enterprise portal pages, extracting and optimizing them via plugins like <code>MiniCssExtractPlugin</code>.
                    </p>
                    <p>
                      <strong>What happens during rebuild:</strong> When <code>npm run dev:prod</code> runs in watch mode, entries are evaluated and rewritten even if their underlying source files under <code>kaisetu-pack/src/</code> remain untouched.
                      This creates formatting and minification-only noise that pollutes pull requests. This skill provides an autonomous, verified cleanup mechanism to restore hygiene before commit.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BUNDLED SCRIPTS */}
          {activeTab === 'scripts' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedScript('find')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      selectedScript === 'find'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    scripts/find-webpack-noise.js (Node.js)
                  </button>
                  <button
                    onClick={() => setSelectedScript('revert')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      selectedScript === 'revert'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    scripts/revert-noise.sh (Bash)
                  </button>
                </div>

                <button
                  onClick={() =>
                    copyScriptToClipboard(
                      selectedScript,
                      selectedScript === 'find'
                        ? SCRIPT_FIND_WEBPACK_NOISE
                        : SCRIPT_REVERT_NOISE
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
                >
                  {copiedScriptKey === selectedScript ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">
                        {locale === 'en' ? 'Script Copied!' : 'スクリプトをコピーしました'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'en' ? 'Copy Script' : 'コードをコピー'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Script Viewer */}
              <div className="rounded-xl bg-[#060a12] border border-slate-800 overflow-hidden">
                <div className="px-4 py-2 bg-[#090e1a] border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>
                    {selectedScript === 'find'
                      ? 'scripts/find-webpack-noise.js • 135 lines • Node.js'
                      : 'scripts/revert-noise.sh • 44 lines • Bash'}
                  </span>
                  <span className="text-emerald-400">Strict Safety Net Guarded</span>
                </div>
                <div className="p-4 overflow-x-auto max-h-[50vh] text-xs font-mono text-slate-200 leading-relaxed">
                  <pre>
                    <code>
                      {selectedScript === 'find'
                        ? SCRIPT_FIND_WEBPACK_NOISE
                        : SCRIPT_REVERT_NOISE}
                    </code>
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
                  clean-kaisetu-asset-rebuilds.skill.md • 456 lines • 19,919 bytes
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
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{locale === 'en' ? 'Copy All Markdown' : '全文コピー'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-[#060a12] border border-slate-800 overflow-hidden">
                <div className="p-4 overflow-x-auto max-h-[55vh] text-xs font-mono text-slate-200 leading-relaxed">
                  <pre>
                    <code>{rawMarkdown || 'Loading markdown content...'}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#070b14]/95 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">
              Target path:{' '}
              <code className="text-cyan-300">
                ~/.cursor/skills/clean-kaisetu-asset-rebuilds/SKILL.md
              </code>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
            >
              {locale === 'en' ? 'Close' : '閉じる'}
            </button>

            <a
              href={downloadUrl}
              download={downloadFilename}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>
                {locale === 'en'
                  ? 'Download Skill (.md) for Review'
                  : 'レビュー用にSkill (.md) をダウンロード'}
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
